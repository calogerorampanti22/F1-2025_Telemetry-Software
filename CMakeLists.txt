cmake_minimum_required(VERSION 3.10)

# Project name and programming language
project(F1TelemetryApp VERSION 1.0 LANGUAGES CXX)

# Forcing use of C++ 17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find and link socket library automatically if it compiles on Windows
if(WIN32)
    link_libraries(ws2_32)
endif()

# Defining executable e source files to compile
add_executable(f1_telemetry 
    src/main.cpp
    src/network/UdpListener.cpp
)

# Tell to compiler where finds .h files when we use #include
target_include_directories(f1_telemetry PRIVATE src)