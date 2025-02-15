from Crypto.Cipher import AES
import base64
import hashlib

SECRET_KEY = hashlib.sha256("your-secret-key".encode()).digest()  # 32-byte key

def decrypt_connection_string(encrypted_text):
    try:
        # Decode Base64-encoded ciphertext from React
        encrypted_text_bytes = base64.b64decode(encrypted_text)

        # Create AES cipher in ECB mode with the same 32-byte key
        cipher = AES.new(SECRET_KEY, AES.MODE_ECB)

        # Decrypt & remove padding
        decrypted_bytes = cipher.decrypt(encrypted_text_bytes)
        return decrypted_bytes.decode('utf-8').rstrip()  # Remove padding
    except Exception as e:
        return f"Decryption Error: {str(e)}"