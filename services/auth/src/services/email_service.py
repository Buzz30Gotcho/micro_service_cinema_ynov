import os
import smtplib
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class EmailService:
    """Service d'envoi d'emails pour la réinitialisation de mot de passe"""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@centralcinema.com")
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        
        # Mode développement si SMTP n'est pas configuré
        self.dev_mode = not all([self.smtp_host, self.smtp_user, self.smtp_password])

    def send_password_reset_email(self, to_email, token):
        """
        Envoie un email de réinitialisation de mot de passe
        
        Args:
            to_email (str): Email du destinataire
            token (str): Token de réinitialisation
            
        Returns:
            bool: True si l'email a été envoyé/simulé avec succès
        """
        reset_url = f"{self.frontend_url}/reset-password/{token}"
        
        subject = "Réinitialisation de votre mot de passe - Central Cinema"
        
        sys.stderr.write(f"\n📧 Tentative d'envoi email à: {to_email}\n")
        sys.stderr.write(f"📧 Mode production? {not self.dev_mode}\n")
        sys.stderr.write(f"📧 SMTP_HOST: {self.smtp_host}\n")
        sys.stderr.flush()
        
        # Corps de l'email en HTML
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    color: #6c757d;
                    font-size: 14px;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎬 CENTRAL CINEMA</h1>
            </div>
            <div class="content">
                <h2>Réinitialisation de mot de passe</h2>
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer :</p>
                
                <div style="text-align: center;">
                    <a href="{reset_url}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px; font-family: monospace;">
                    {reset_url}
                </p>
                
                <div class="warning">
                    <strong>⚠️ Important :</strong> Ce lien est valide pendant <strong>1 heure</strong> seulement.
                </div>
                
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
            </div>
            <div class="footer">
                <p>© 2025 Central Cinema - Projet Microservices</p>
                <p style="font-size: 12px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
        </body>
        </html>
        """
        
        # Version texte brut
        text_body = f"""
        CENTRAL CINEMA - Réinitialisation de mot de passe
        
        Bonjour,
        
        Vous avez demandé à réinitialiser votre mot de passe.
        
        Cliquez sur ce lien pour continuer :
        {reset_url}
        
        ⚠️ Ce lien est valide pendant 1 heure seulement.
        
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        
        ---
        © 2025 Central Cinema
        """
        
        if self.dev_mode:
            # Mode développement : afficher dans la console
            sys.stderr.write("\n" + "="*80 + "\n")
            sys.stderr.write("📧 EMAIL DE RÉINITIALISATION (MODE DÉVELOPPEMENT)\n")
            sys.stderr.write("="*80 + "\n")
            sys.stderr.write(f"À: {to_email}\n")
            sys.stderr.write(f"Sujet: {subject}\n")
            sys.stderr.write(f"\n🔗 LIEN DE RÉINITIALISATION :\n")
            sys.stderr.write(f"{reset_url}\n")
            sys.stderr.write("="*80 + "\n\n")
            sys.stderr.flush()
            return True
        else:
            # Mode production : envoyer via SMTP
            try:
                sys.stderr.write(f"📧 Tentative connexion SMTP: {self.smtp_host}:{self.smtp_port}\n")
                sys.stderr.flush()
                
                msg = MIMEMultipart('alternative')
                msg['From'] = self.from_email
                msg['To'] = to_email
                msg['Subject'] = subject
                
                # Attacher les versions texte et HTML
                part1 = MIMEText(text_body, 'plain', 'utf-8')
                part2 = MIMEText(html_body, 'html', 'utf-8')
                msg.attach(part1)
                msg.attach(part2)
                
                # Connexion et envoi
                sys.stderr.write(f"🔐 Authentification SMTP...\n")
                sys.stderr.flush()
                
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()
                    sys.stderr.write(f"🔑 Login...\n")
                    sys.stderr.flush()
                    server.login(self.smtp_user, self.smtp_password)
                    sys.stderr.write(f"📤 Envoi...\n")
                    sys.stderr.flush()
                    server.send_message(msg)
                
                sys.stderr.write(f"✅ Email envoyé à {to_email}\n")
                sys.stderr.flush()
                return True
                
            except Exception as e:
                sys.stderr.write(f"❌ Erreur SMTP: {str(e)}\n")
                import traceback
                sys.stderr.write(traceback.format_exc())
                sys.stderr.flush()
                return False


# Instance singleton
email_service = EmailService()
