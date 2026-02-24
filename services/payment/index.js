import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const { Pool } = pg;

// Middleware
app.use(express.json());

// Database connection pool
let dbPool;

// Initialize database pool
async function initializeDatabase() {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 2000;

    while (attempts < maxAttempts) {
        try {
            dbPool = new Pool({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: process.env.DB_NAME || 'payment_db',
                user: process.env.DB_USER || 'payment_user',
                password: process.env.DB_PASSWORD || 'payment_pass',
            });

            // Test connection
            const client = await dbPool.connect();
            console.log('Connected to payment database');
            client.release();

            // Create table if it doesn't exist
            await dbPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reservation_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        transaction_id VARCHAR(255) UNIQUE,
        card_last_digits VARCHAR(4),
        card_holder_name VARCHAR(255),
        failure_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      )
    `);
            console.log('Payments table ready');
            return;
        } catch (error) {
            attempts++;
            console.log(`Database connection attempt ${attempts}/${maxAttempts} failed:`, error.message);
            if (attempts < maxAttempts) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Failed to connect to database after all attempts. Service may not work correctly.');
            }
        }
    }
}

// Helper functions
function generateTransactionId() {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function simulatePaymentProcessing(payment) {
    // Simulate payment processing with 95% success rate
    return new Promise((resolve) => {
        setTimeout(() => {
            const isSuccess = Math.random() < 0.95;

            if (isSuccess) {
                payment.status = 'completed';
                payment.processed_at = new Date();
            } else {
                payment.status = 'failed';
                payment.failure_reason = 'Carte bancaire refusée - Solde insuffisant';
            }

            resolve(payment);
        }, 1000);
    });
}

// Routes

// Process payment
app.post('/payments/process', async (req, res) => {
    const { reservationId, amount, paymentMethod, cardLastDigits, cardHolderName } = req.body;

    if (!amount || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields: amount and paymentMethod are required' });
    }

    try {
        const payment = {
            id: uuidv4(),
            reservation_id: reservationId,
            amount,
            payment_method: paymentMethod,
            status: 'pending',
            transaction_id: generateTransactionId(),
            card_last_digits: cardLastDigits || null,
            card_holder_name: cardHolderName || null,
            failure_reason: null,
            created_at: new Date(),
            updated_at: new Date(),
            processed_at: null,
        };

        // Simulate payment processing
        const processedPayment = await simulatePaymentProcessing(payment);

        // Save to database
        const result = await dbPool.query(
            `INSERT INTO payments 
       (id, reservation_id, amount, payment_method, status, transaction_id, card_last_digits, card_holder_name, failure_reason, created_at, updated_at, processed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
            [
                processedPayment.id,
                processedPayment.reservation_id,
                processedPayment.amount,
                processedPayment.payment_method,
                processedPayment.status,
                processedPayment.transaction_id,
                processedPayment.card_last_digits,
                processedPayment.card_holder_name,
                processedPayment.failure_reason,
                processedPayment.created_at,
                processedPayment.updated_at,
                processedPayment.processed_at,
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// Get payment by ID
app.get('/payments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await dbPool.query(
            'SELECT * FROM payments WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
});

// Get payments by reservation ID
app.get('/payments/reservation/:reservationId', async (req, res) => {
    const { reservationId } = req.params;

    try {
        const result = await dbPool.query(
            'SELECT * FROM payments WHERE reservation_id = $1 ORDER BY created_at DESC',
            [reservationId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Refund payment
app.post('/payments/:id/refund', async (req, res) => {
    const { id } = req.params;

    try {
        // First, get the current payment
        const paymentResult = await dbPool.query(
            'SELECT * FROM payments WHERE id = $1',
            [id]
        );

        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const payment = paymentResult.rows[0];

        if (payment.status !== 'completed') {
            return res.status(400).json({ error: 'Only completed payments can be refunded' });
        }

        // Update payment status to refunded
        const result = await dbPool.query(
            'UPDATE payments SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
            ['refunded', new Date(), id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error refunding payment:', error);
        res.status(500).json({ error: 'Failed to refund payment' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.APP_PORT || 4004;

async function start() {
    try {
        await initializeDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Payment service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (dbPool) {
        await dbPool.end();
    }
    process.exit(0);
});
