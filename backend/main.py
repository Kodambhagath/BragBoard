from fastapi import FastAPI
from database import Base, engine
from routes.user import router as user_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register routes
app.include_router(user_router)
