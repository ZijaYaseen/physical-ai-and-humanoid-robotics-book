from fastapi import FastAPI

# Create FastAPI app instance without any middleware
app = FastAPI(title="No Middleware Test Server")

@app.get("/")
def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8004)