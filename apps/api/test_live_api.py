import urllib.request
import json

def test_api():
    print("Testing live API health...")
    try:
        req = urllib.request.Request("https://howtotech-api.onrender.com/health")
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            print(f"Health response status: {status}")
            print(f"Health response body: {body}")
    except Exception as e:
        print(f"Health check failed: {e}")

    print("\nTesting live API guides count...")
    try:
        req = urllib.request.Request("https://howtotech-api.onrender.com/guides")
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.getcode()
            guides = json.loads(response.read().decode('utf-8'))
            print(f"Guides response status: {status}")
            print(f"Total guides in database: {len(guides)}")
    except Exception as e:
        print(f"Guides check failed: {e}")

if __name__ == "__main__":
    test_api()
