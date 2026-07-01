cmake_minimum_required(VERSION 3.14)

if(POLICY CMP0135)
    cmake_policy(SET CMP0135 NEW)
endif()

# Project name and programming language
project(F1TelemetryApp VERSION 1.0 LANGUAGES CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Forcing use of C++ 17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- Autonomous dependencies managing ---
include(FetchContent)

# 1. JSON library (nlohmann)
FetchContent_Declare(json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

if(WIN32)
    set(ASIO_INCLUDE_DIR "C:/msys64/ucrt64/include" CACHE PATH "ASIO Path Force" FORCE)
endif()

# 2. Web Framework and WebSocket (Crow)
FetchContent_Declare(Crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG master
)
FetchContent_MakeAvailable(Crow)
# --------------------------------------------

# Defining executable e source files to compile
add_executable(f1_telemetry 
    src/main.cpp
    src/network/UDPListener.cpp
    src/parser/PacketParser.cpp
    src/models/Lap.hpp
    src/models/Session.hpp
    src/models/CarTelemetry.hpp
    src/models/CarStatus.hpp
)

if(MINGW)
    target_link_options(f1_telemetry PRIVATE -static)
endif()

# Tell to compiler where finds .h files when we use #include
target_include_directories(f1_telemetry PRIVATE src)

# link libraries to executable
target_link_libraries(f1_telemetry PRIVATE nlohmann_json::nlohmann_json Crow::Crow)

# Required libraries to make sockets work on Windows
if(WIN32)
    target_link_libraries(f1_telemetry PRIVATE ws2_32 wsock32)
endif()