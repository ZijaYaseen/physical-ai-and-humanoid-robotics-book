---
sidebar_position: 2
---

# Module 1: ROS 2 - Robot Operating System Fundamentals

## Overview

ROS 2 (Robot Operating System 2) is the next generation robotics middleware that provides libraries and tools to help software developers create robot applications. It's designed to be more robust, scalable, and suitable for production environments than its predecessor. This comprehensive module will guide you through all essential ROS 2 concepts, from basic architecture to advanced distributed computing patterns.

## Learning Objectives

By the end of this module, you will be able to:
- Understand the core concepts of ROS 2 architecture and distributed computing
- Create and run complex ROS 2 nodes with proper lifecycle management
- Implement advanced communication patterns using topics, services, and actions
- Use ROS 2 tools for debugging, visualization, and system management
- Integrate ROS 2 with other robotics frameworks and simulation environments
- Apply best practices for performance optimization and system reliability

## Part 1: Core Architecture and Concepts

### 1.1 ROS 2 Architecture

ROS 2 uses a distributed architecture based on the Data Distribution Service (DDS) standard, which provides:

- **Nodes**: Independent processes that perform computation and can communicate with other nodes
- **Topics**: Named buses over which nodes exchange messages in a publish/subscribe pattern
- **Services**: Synchronous request/response communication for immediate responses
- **Actions**: Asynchronous request/response with feedback and goal preemption for long-running tasks

### 1.2 Communication Patterns

#### Publisher-Subscriber Pattern
- **Topics**: Asynchronous communication where publishers send messages to topics and subscribers receive them
- **Message Types**: Strongly typed messages defined in `.msg` files
- **Quality of Service (QoS)**: Configurable policies for reliability, durability, and performance

#### Client-Service Pattern
- **Services**: Synchronous communication for immediate request/response interactions
- **Service Types**: Defined in `.srv` files with request and response structures
- **Use Cases**: Configuration, calibration, immediate data requests

#### Action Pattern
- **Actions**: Asynchronous communication for long-running tasks with feedback
- **Action Types**: Defined in `.action` files with goal, result, and feedback structures
- **Use Cases**: Navigation, manipulation, complex task execution

## Part 2: Practical Implementation

### 2.1 Installation and Setup

#### Ubuntu Installation
```bash
# Add ROS 2 GPG key and repository
sudo apt update && sudo apt install curl gnupg lsb-release
curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key | sudo gpg --dearmor -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 packages
sudo apt update
sudo apt install ros-humble-desktop
sudo apt install python3-rosdep2
sudo rosdep init
rosdep update
```

#### Windows and macOS Installation
- **Windows**: Use the ROS 2 Windows binary installer
- **macOS**: Use Homebrew or build from source

### 2.2 Creating Your First ROS 2 Package

```bash
# Source ROS 2 environment
source /opt/ros/humble/setup.bash

# Create workspace
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Create a new package
colcon build
source install/setup.bash
ros2 pkg create --build-type ament_python my_robot_package
```

### 2.3 Advanced Node Development

```python
# Example of an advanced ROS 2 node with lifecycle management
import rclpy
from rclpy.lifecycle import LifecycleNode, LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSProfile
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class AdvancedRobotController(LifecycleNode):
    def __init__(self):
        super().__init__('advanced_robot_controller')
        self.subscription = None
        self.publisher = None

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        qos_profile = QoSProfile(depth=10)
        self.subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.laser_callback,
            qos_profile
        )
        self.publisher = self.create_publisher(Twist, 'cmd_vel', qos_profile)
        self.get_logger().info('Configured')
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.subscription  # Activate subscription
        self.publisher  # Activate publisher
        self.get_logger().info('Activated')
        return TransitionCallbackReturn.SUCCESS

    def laser_callback(self, msg):
        # Process laser scan data and control robot
        cmd = Twist()
        # Implement obstacle avoidance logic
        self.publisher.publish(cmd)

def main(args=None):
    rclpy.init(args=args)
    node = AdvancedRobotController()
    rclpy.spin(node)
    rclpy.shutdown()
```

## Part 3: Advanced Topics

### 3.1 Launch Files and System Management

Launch files allow you to start multiple nodes with a single command:

```python
# launch/my_robot_system.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node, LifecycleNode
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration

def generate_launch_description():
    use_sim_time = LaunchConfiguration('use_sim_time')

    return LaunchDescription([
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='false',
            description='Use simulation clock if true'
        ),

        Node(
            package='my_robot_package',
            executable='robot_controller',
            name='robot_controller',
            parameters=[
                {'wheel_diameter': 0.1},
                {'max_velocity': 1.0},
                {'use_sim_time': use_sim_time}
            ],
            remappings=[
                ('/cmd_vel', '/my_cmd_vel'),
                ('/scan', '/my_scan')
            ]
        ),

        Node(
            package='my_robot_package',
            executable='sensor_processor',
            name='sensor_processor',
            parameters=[{'sensor_timeout': 1.0}]
        )
    ])
```

### 3.2 Parameters and Configuration

ROS 2 provides a flexible parameter system:

```python
# Python parameter usage with validation
import rclpy
from rclpy.node import Node
from rcl_interfaces.msg import ParameterDescriptor, ParameterType

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')

        # Declare parameters with validation and descriptions
        self.declare_parameter(
            'wheel_diameter',
            0.1,
            ParameterDescriptor(
                name='wheel_diameter',
                type=ParameterType.PARAMETER_DOUBLE,
                description='Diameter of the robot wheels in meters',
                additional_constraints='Must be positive',
                floating_point_range=[rcl_interfaces.msg.FloatingPointRange(from_value=0.0, to_value=10.0)]
            )
        )

        self.declare_parameter('max_velocity', 1.0)

        # Get parameter values
        self.wheel_diameter = self.get_parameter('wheel_diameter').value
        self.max_velocity = self.get_parameter('max_velocity').value
```

## Part 4: Real-World Applications

### 4.1 Navigation Stack Integration

ROS 2 Navigation2 stack provides:
- **AMCL**: Adaptive Monte Carlo Localization for pose estimation
- **Costmap 2D**: 2D costmap representation for obstacle avoidance
- **Controllers**: Path following and trajectory generation algorithms
- **Sensors**: Integration with various sensor types (lidar, cameras, IMU)

### 4.2 Simulation Integration

ROS 2 works seamlessly with simulation environments:
- **Gazebo**: Physics-based simulation with realistic physics
- **Ignition**: Next-generation simulation framework with enhanced capabilities
- **Webots**: Robot simulation software with built-in physics engine

## Part 5: Best Practices and Troubleshooting

### 5.1 Performance Optimization
- Use appropriate QoS profiles for your application requirements
- Implement proper error handling and recovery mechanisms
- Optimize message frequency and size to reduce network overhead
- Use multi-threading where appropriate for concurrent operations

### 5.2 Common Issues and Solutions
- **Node Discovery**: Ensure proper network configuration and DDS domain settings
- **Message Serialization**: Use efficient message types and compression when needed
- **Resource Management**: Monitor CPU and memory usage for optimal performance
- **Debugging**: Use `rqt`, `ros2 topic`, `ros2 service`, and `ros2 action` tools

### 5.3 Security Considerations
- Implement proper authentication and authorization mechanisms
- Use encrypted communication for sensitive data
- Regularly update ROS 2 packages and dependencies
- Follow security best practices for distributed systems

## Practical Exercises

Complete the interactive notebooks in the `notebooks/` directory to practice:
- Creating complex ROS 2 nodes with lifecycle management
- Implementing advanced communication patterns
- Working with launch files and system configuration
- Integrating with simulation environments

## Next Steps

After completing this module, proceed to [Module 2: Simulation](./module-2-simulation.md) to learn about simulation environments for robotics and how to test your ROS 2 applications in virtual environments.