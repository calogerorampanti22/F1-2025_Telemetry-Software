#include <iostream>
#include <vector>
#include <mutex>
#include <unordered_set>
#include "crow.h"

#include "network/UDPListener.h"
#include "parser/PacketParser.h"

int main() {
    std::cout << "=== F1 25 Backend Server ===" << std::endl;

    // Thread-safe variable to manage connected clients
    std::mutex mtx;
    std::unordered_set<crow::websocket::connection *> clients;

    crow::SimpleApp app;

    //Defininig WebSockets route
    CROW_WEBSOCKET_ROUTE(app, "/telemetry")
        .onopen([&](crow::websocket::connection& conn) {
            std::lock_guard<std::mutex> lock(mtx);
            clients.insert(&conn);
            std::cout << "[WEB] New Frontend connected" << std::endl;
        })
        .onclose([&](crow::websocket::connection& conn, const std::string& reason, uint16_t code) {
            std::lock_guard<std::mutex> lock(mtx);
            clients.erase(&conn);
            std::cout << "[WEB] Frontend disconnected (Code" << code << ")." << std::endl;
        })
        .onmessage([&](crow::websocket::connection& conn, const std::string&, bool) {
            // Ignore frontend message
        });

    UDPListener listener(20777);
    PacketParser parser;

    // Callback for UDP data on arrive
    listener.start([&](const std::vector<uint8_t>&data) {

        std::string jsonStr = parser.parsePacketToJson(data);

        // If there is a valid JSON, we send to all connected clients
        if(!jsonStr.empty()) {

            std::lock_guard<std::mutex> lock(mtx);

            for(auto* client : clients) {
                client->send_text(jsonStr);
            }
        }
    });

    std::cout << "[UDP] Listening on port 20777..." << std::endl;
    std::cout << "[WEB] Server listening on port 8080...\n" << std::endl;

    // Starting Crow (blocking function which manage life cycle)
    app.port(8080).multithreaded().run();

    listener.stop();
    return 0;
}