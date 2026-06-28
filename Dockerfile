FROM ubuntu:22.04

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy CMake configuration and source code
COPY CMakeLists.txt .
COPY src/ ./src/

# Build the application
RUN mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc)

# Expose required ports
EXPOSE 8080
EXPOSE 20777/udp

# Run the application
CMD ["./build/f1_telemetry"]
