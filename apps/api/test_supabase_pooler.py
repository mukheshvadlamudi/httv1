import urllib.parse
from sqlalchemy import create_engine, text

def test_pooler():
    pwd = "flas@unicro"
    encoded_pwd = urllib.parse.quote_plus(pwd)
    
    # Test aws-1-ap-south-1.pooler.supabase.com
    url_aws1_5432 = f"postgresql+psycopg://postgres.abglyfjjwdnvxknkpbpk:{encoded_pwd}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    print("Testing aws-1 Session Mode (5432)...")
    try:
        engine = create_engine(url_aws1_5432, connect_args={"connect_timeout": 5})
        with engine.connect() as conn:
            res = conn.execute(text("SELECT 1")).fetchone()
            print(f"SUCCESS aws-1 5432: {res}")
    except Exception as e:
        print(f"FAILED aws-1 5432: {e}")

    url_aws1_6543 = f"postgresql+psycopg://postgres.abglyfjjwdnvxknkpbpk:{encoded_pwd}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
    print("\nTesting aws-1 Transaction Mode (6543)...")
    try:
        engine = create_engine(url_aws1_6543, connect_args={"connect_timeout": 5})
        with engine.connect() as conn:
            res = conn.execute(text("SELECT 1")).fetchone()
            print(f"SUCCESS aws-1 6543: {res}")
    except Exception as e:
        print(f"FAILED aws-1 6543: {e}")

if __name__ == "__main__":
    test_pooler()
