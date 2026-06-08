/* src/data/buildingData.js
 *
 * Generates the initial BMS state with a normalized shape:
 *   state.building   – top-level KPIs
 *   state.floors     – { [floorId]: floorObj }  (keyed by id)
 *   state.clients    – { [clientId]: clientObj }
 *   state.equipment  – { ["clientId-Type"]: eqObj }
 *   state.alarms     – []
 *   state.recentEvents – []
 */

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EQUIPMENT_TYPES = [
  "AHU", "Chiller", "AC Unit", "Lighting",
  "Energy Meter", "Pump", "Fire Alarm", "Occupancy Sensor",
];

export function generateInitialState() {
  const floors = {};
  const clients = {};
  const equipment = {};

  let totalLoad = 0;
  let totalKWh = 0;
  let totalAlarms = 0;
  let healthSum = 0;
  let clientCount = 0;
  let runningEquip = 0;

  for (let f = 1; f <= 20; f++) {
    const clientIds = [];
    let floorLoad = 0;
    let floorKWh = 0;
    let floorHealthSum = 0;
    let floorAlarms = 0;

    for (let c = 1; c <= 4; c++) {
      const clientId = f * 10 + c;           // 11, 12, 13, 14 … 201, 202, 203, 204
      clientIds.push(clientId);
      clientCount++;

      const eqIds = [];
      let clientLoad = 0;
      let clientHealthSum = 0;
      let clientAlarms = 0;

      EQUIPMENT_TYPES.forEach((eqType) => {
        const eqId = `${clientId}-${eqType}`;
        const load = randInt(0, 100);
        const health = randInt(70, 100);
        const status = health > 90 ? "healthy" : health > 75 ? "warning" : "critical";
        const running = Math.random() > 0.1;

        equipment[eqId] = {
          id: eqId,
          clientId,
          type: eqType,
          currentLoad: load,
          health,
          status,
          running,
          alarm: status === "critical",
          lastUpdated: new Date().toISOString(),
        };

        eqIds.push(eqId);
        clientLoad += load;
        clientHealthSum += health;
        if (status === "critical") clientAlarms++;
        if (running) runningEquip++;
      });

      const cHealth = Math.round(clientHealthSum / EQUIPMENT_TYPES.length);
      const cStatus = cHealth > 90 ? "healthy" : cHealth > 75 ? "warning" : "critical";

      clients[clientId] = {
        id: clientId,
        floorId: f,
        name: `Client ${clientId}`,
        equipmentIds: eqIds,
        currentLoad: clientLoad,
        dailyKWh: randInt(100, 500),
        health: cHealth,
        status: cStatus,
        alarmCount: clientAlarms,
      };

      floorLoad += clientLoad;
      floorKWh += clients[clientId].dailyKWh;
      floorHealthSum += cHealth;
      floorAlarms += clientAlarms;
    }

    const fHealth = Math.round(floorHealthSum / 4);
    const fStatus = fHealth > 90 ? "healthy" : fHealth > 75 ? "warning" : "critical";

    floors[f] = {
      id: f,
      name: `Floor ${f}`,
      clientIds,
      currentLoad: floorLoad,
      dailyKWh: floorKWh,
      health: fHealth,
      status: fStatus,
      alarmCount: floorAlarms,
    };

    totalLoad += floorLoad;
    totalKWh += floorKWh;
    healthSum += fHealth;
    totalAlarms += floorAlarms;
  }

  const healthScore = Math.round(healthSum / 20);
  const efficiencyPct = randInt(78, 96);
  const monthlyCostINR = Math.round(totalKWh * 8.5);

  return {
    building: {
      name: "Building overview",
      totalLoadKW: totalLoad,
      totalConsumptionKWh: totalKWh,
      activeClients: clientCount,
      runningEquipment: runningEquip,
      activeAlarms: totalAlarms,
      monthlyCostINR,
      healthScore,
      efficiencyPct,
      epx: +(totalKWh / clientCount).toFixed(1),
    },
    floors,
    clients,
    equipment,
    alarms: [
      { id: 1, severity: "critical", message: "Generator-02 offline", timestamp: new Date().toLocaleTimeString() },
      { id: 2, severity: "warning",  message: "HVAC-05 high temp",    timestamp: new Date().toLocaleTimeString() },
      { id: 3, severity: "info",     message: "Lift-01 maintenance OK", timestamp: new Date().toLocaleTimeString() },
    ],
    recentEvents: [
      { id: 1, label: "System Boot",      detail: "BMS controller restarted",         time: "08:00 AM" },
      { id: 2, label: "Alarm Cleared",    detail: "HVAC-03 temp normalized",          time: "09:15 AM" },
      { id: 3, label: "Schedule Change",  detail: "Lighting schedule updated (F12)",  time: "10:30 AM" },
      { id: 4, label: "Energy Milestone", detail: "Daily peak demand < 450 kW",       time: "11:45 AM" },
    ],
  };
}
