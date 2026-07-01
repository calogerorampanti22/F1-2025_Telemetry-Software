#pragma once

#include <cstdint>
#include <iostream>
#include <nlohmann/json.hpp>

#include "../parser/F1Structs.h"

class CarStatus {
    private:
        uint8_t m_tractionControl;
        uint8_t m_antiLockBrakes;
        uint8_t m_fuelMix;
        uint8_t m_frontBrakeBias;
        uint8_t m_pitLimiterStatus;
        float m_fuelInTank;
        float m_fuelCapacity;
        float m_fuelRemainingLaps;
        uint16_t m_maxRPM;
        uint16_t m_idleRPM;
        uint8_t m_maxGears;
        uint8_t m_drsAllowed;
        uint16_t m_drsActivationDistance;
        uint8_t m_actualTyreCompound;
        uint8_t m_visualTyreCompound;
        uint8_t m_tyresAgeLaps;
        int8_t m_vehicleFiaFlags;
        float m_enginePowerICE;
        float m_enginePowerMGUK;
        float m_ersStoreEnergy;
        uint8_t m_ersDeployMode;
        float m_ersHarvestedThisLapMGUK;
        float m_ersHarvestedThisLapMGUH;
        float m_ersDeployedThisLap;
        uint8_t m_networkPaused;

    public:
        CarStatus(CarStatusData data)
            : m_tractionControl(data.m_tractionControl),
            m_antiLockBrakes(data.m_antiLockBrakes),
            m_fuelMix(data.m_fuelMix),
            m_frontBrakeBias(data.m_frontBrakeBias),
            m_pitLimiterStatus(data.m_pitLimiterStatus),
            m_fuelInTank(data.m_fuelInTank),
            m_fuelCapacity(data.m_fuelCapacity),
            m_fuelRemainingLaps(data.m_fuelRemainingLaps),
            m_maxRPM(data.m_maxRPM),
            m_idleRPM(data.m_idleRPM),
            m_maxGears(data.m_maxGears),
            m_drsAllowed(data.m_drsAllowed),
            m_drsActivationDistance(data.m_drsActivationDistance),
            m_actualTyreCompound(data.m_actualTyreCompound),
            m_visualTyreCompound(data.m_visualTyreCompound),
            m_tyresAgeLaps(data.m_tyresAgeLaps),
            m_vehicleFiaFlags(data.m_vehicleFiaFlags),
            m_enginePowerICE(data.m_enginePowerICE),
            m_enginePowerMGUK(data.m_enginePowerMGUK),
            m_ersStoreEnergy(data.m_ersStoreEnergy),
            m_ersDeployMode(data.m_ersDeployMode),
            m_ersHarvestedThisLapMGUK(data.m_ersHarvestedThisLapMGUK),
            m_ersHarvestedThisLapMGUH(data.m_ersHarvestedThisLapMGUH),
            m_ersDeployedThisLap(data.m_ersDeployedThisLap),
            m_networkPaused(data.m_networkPaused)
        {}

        std::string toJson() {
            nlohmann::json jsonObject;

            jsonObject["type"] = "carStatus";
            jsonObject["tractionControl"] = m_tractionControl;
            jsonObject["antiLockBrakes"] = m_antiLockBrakes;
            jsonObject["fuelMix"] = m_fuelMix;
            jsonObject["frontBrakeBias"] = m_frontBrakeBias;
            jsonObject["pitLimiterStatus"] = m_pitLimiterStatus;
            jsonObject["fuelInTank"] = m_fuelInTank;
            jsonObject["fuelCapacity"] = m_fuelCapacity;
            jsonObject["fuelRemainingLaps"] = m_fuelRemainingLaps;
            jsonObject["maxRPM"] = m_maxRPM;
            jsonObject["idleRPM"] = m_idleRPM;
            jsonObject["maxGears"] = m_maxGears;
            jsonObject["drsAllowed"] = m_drsAllowed;
            jsonObject["drsActivationDistance"] = m_drsActivationDistance;
            jsonObject["actualTyreCompound"] = m_actualTyreCompound;
            jsonObject["visualTyreCompound"] = m_visualTyreCompound;
            jsonObject["tyresAgeLaps"] = m_tyresAgeLaps;
            jsonObject["vehicleFiaFlags"] = m_vehicleFiaFlags;
            jsonObject["enginePowerICE"] = m_enginePowerICE;
            jsonObject["enginePowerMGUK"] = m_enginePowerMGUK;
            jsonObject["ersStoreEnergy"] = m_ersStoreEnergy;
            jsonObject["ersDeployMode"] = m_ersDeployMode;
            jsonObject["ersHarvestedThisLapMGUK"] = m_ersHarvestedThisLapMGUK;
            jsonObject["ersHarvestedThisLapMGUH"] = m_ersHarvestedThisLapMGUH;
            jsonObject["ersDeployedThisLap"] = m_ersDeployedThisLap;
            jsonObject["networkPaused"] = m_networkPaused;

            return jsonObject.dump();
        }
};