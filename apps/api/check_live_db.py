import urllib.parse
from sqlalchemy import create_engine, text

def check_db():
    pwd = "flas@unicro"
    encoded_pwd = urllib.parse.quote_plus(pwd)
    url = f"postgresql+psycopg://postgres.abglyfjjwdnvxknkpbpk:{encoded_pwd}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    
    print("Connecting to live Supabase...")
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            # Check existing tables
            tables = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)).fetchall()
            print("Tables in public schema:")
            for t in tables:
                print(f" - {t[0]}")
                
            # Check users
            users = conn.execute(text("SELECT count(*) FROM users")).fetchone()
            print(f"\nNumber of registered users: {users[0]}")
            
            # Check guides
            guides = conn.execute(text("SELECT count(*) FROM guides")).fetchone()
            print(f"Number of guides: {guides[0]}")
            
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_db()
