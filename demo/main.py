"""
Physical AI & Humanoid Robotics Demo Application

This FastAPI application demonstrates a complete pipeline from voice/text command
to robot action planning and simulation. The demo shows how different components
work together in a complete system.
"""

import asyncio
import logging
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI & Humanoid Robotics Demo",
    description="A demo application showing the complete robotics pipeline",
    version="1.0.0"
)

# Request/Response models
class VoiceCommand(BaseModel):
    text: str
    robot_type: str = "humanoid"
    simulation_mode: bool = True

class ActionPlan(BaseModel):
    action_type: str
    target_object: Optional[str] = None
    target_location: Optional[Dict[str, float]] = None
    trajectory: Optional[list] = None
    execution_time: float

class PipelineResponse(BaseModel):
    command: str
    plan: ActionPlan
    simulation_result: str
    processing_time: float

# Mock components for simulation mode
class MockSpeechProcessor:
    """Mock speech processing component"""
    def __init__(self):
        self.name = "Mock Speech Processor"
        logger.info(f"{self.name} initialized")

    def process_command(self, command_text: str) -> Dict[str, Any]:
        """Process voice/text command and extract intent"""
        logger.info(f"Processing command: {command_text}")

        # Simple keyword matching for demo purposes
        command_lower = command_text.lower()

        if "move" in command_lower or "go" in command_lower:
            action_type = "navigate"
            target = "location" if "location" in command_lower else "object"
        elif "pick" in command_lower or "grasp" in command_lower:
            action_type = "grasp"
            target = "object"
        elif "push" in command_lower or "press" in command_lower:
            action_type = "manipulate"
            target = "button"
        else:
            action_type = "unknown"
            target = "unknown"

        return {
            "action_type": action_type,
            "target": target,
            "raw_command": command_text
        }

class MockActionPlanner:
    """Mock action planning component"""
    def __init__(self):
        self.name = "Mock Action Planner"
        logger.info(f"{self.name} initialized")

    def create_plan(self, intent: Dict[str, Any]) -> ActionPlan:
        """Create action plan based on intent"""
        logger.info(f"Creating plan for intent: {intent}")

        # Simulate planning time
        time.sleep(0.1)

        # Generate mock plan based on intent
        plan = ActionPlan(
            action_type=intent["action_type"],
            target_object=intent["target"],
            target_location={"x": 1.0, "y": 0.5, "z": 0.0} if intent["target"] != "unknown" else None,
            trajectory=[[0.0, 0.0, 0.0], [0.5, 0.25, 0.0], [1.0, 0.5, 0.0]] if intent["target"] != "unknown" else None,
            execution_time=2.5  # Estimated execution time in seconds
        )

        return plan

class MockRobotSimulator:
    """Mock robot simulator"""
    def __init__(self):
        self.name = "Mock Robot Simulator"
        logger.info(f"{self.name} initialized")

    def execute_action(self, plan: ActionPlan) -> str:
        """Execute action plan in simulation"""
        logger.info(f"Executing action plan: {plan.action_type}")

        # Simulate execution time
        time.sleep(0.2)

        # Generate mock simulation result
        if plan.action_type == "navigate":
            result = f"Robot navigated to {plan.target_object or 'destination'} successfully"
        elif plan.action_type == "grasp":
            result = f"Robot grasped {plan.target_object or 'object'} successfully"
        elif plan.action_type == "manipulate":
            result = f"Robot manipulated {plan.target_object or 'object'} successfully"
        else:
            result = f"Robot executed unknown action: {plan.action_type}"

        return result

# Initialize components
speech_processor = MockSpeechProcessor()
action_planner = MockActionPlanner()
robot_simulator = MockRobotSimulator()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Physical AI & Humanoid Robotics Demo API",
        "description": "A complete pipeline from voice command to robot action simulation",
        "endpoints": {
            "/process-command": "POST endpoint to process voice/text commands",
            "/health": "GET endpoint for health check"
        }
    }

@app.post("/process-command", response_model=PipelineResponse)
async def process_command(command: VoiceCommand):
    """
    Process a voice or text command and return the complete pipeline result.

    This endpoint demonstrates the full pipeline:
    1. Voice/text command processing
    2. Action planning
    3. Robot action simulation
    """
    start_time = time.time()

    try:
        # Step 1: Process the command
        intent = speech_processor.process_command(command.text)

        # Step 2: Create action plan
        plan = action_planner.create_plan(intent)

        # Step 3: Execute in simulation
        simulation_result = robot_simulator.execute_action(plan)

        # Calculate processing time
        processing_time = time.time() - start_time

        # Return complete response
        response = PipelineResponse(
            command=command.text,
            plan=plan,
            simulation_result=simulation_result,
            processing_time=processing_time
        )

        logger.info(f"Pipeline completed in {processing_time:.3f}s")
        return response

    except Exception as e:
        logger.error(f"Pipeline execution failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "components": {
            "speech_processor": "ready",
            "action_planner": "ready",
            "robot_simulator": "ready"
        },
        "timestamp": time.time()
    }

@app.get("/demo-info")
async def demo_info():
    """Return information about the demo application"""
    return {
        "title": "Physical AI & Humanoid Robotics Pipeline Demo",
        "description": "Demonstrates a complete pipeline from voice command to robot action",
        "pipeline_steps": [
            "Voice/Text Command Processing",
            "Action Planning",
            "Trajectory Generation",
            "Robot Action Simulation"
        ],
        "simulation_mode": True,
        "robot_types_supported": ["humanoid", "quadruped", "wheeled"]
    }

# Additional utility endpoints
@app.post("/simulate-trajectory")
async def simulate_trajectory(trajectory: list):
    """Simulate a robot trajectory"""
    logger.info(f"Simulating trajectory with {len(trajectory)} waypoints")

    # Validate trajectory
    if len(trajectory) < 2:
        raise HTTPException(status_code=400, detail="Trajectory must have at least 2 waypoints")

    # Simulate trajectory execution
    total_distance = 0.0
    for i in range(1, len(trajectory)):
        prev_point = np.array(trajectory[i-1])
        curr_point = np.array(trajectory[i])
        distance = np.linalg.norm(curr_point - prev_point)
        total_distance += distance

    simulation_time = total_distance * 0.5  # 0.5 seconds per unit distance

    return {
        "success": True,
        "trajectory_length": len(trajectory),
        "total_distance": float(total_distance),
        "estimated_time": simulation_time,
        "status": "trajectory_simulated"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Physical AI & Humanoid Robotics Demo application")
    uvicorn.run(app, host="0.0.0.0", port=8000)