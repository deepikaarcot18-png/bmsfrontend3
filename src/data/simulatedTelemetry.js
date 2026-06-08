/* src/data/simulatedTelemetry.js
 *
 * Generates an array of telemetry update objects: { type, id, data }
 * These are dispatched together as one BATCH_UPDATE action to the BMS reducer.
 * Keys match the normalized state shape: floors[id], clients[id], equipment[id].
 */

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EQUIPMENT_TYPES = [
  "AHU", "Chiller", "AC Unit", "Lighting",
  "Energy Meter", "Pump", "Fire Alarm", "Occupancy Sensor",
];

const pickSome = (items, count) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function generateTelemetry() {
  const updates = [];
  const floorIds = pickSome(Array.from({ length: 20 }, (_, index) => index + 1), 5);

  floorIds.forEach((f) => {
    updates.push({
      type: 'floors',
      id: f,
      data: {
        currentLoad: randInt(160, 760),
        health: randInt(76, 98),
      },
    });

    pickSome([1, 2, 3, 4], 2).forEach((c) => {
      const clientId = f * 10 + c;
      const clientHealth = randInt(74, 99);
      const clientStatus = clientHealth > 90 ? 'healthy' : clientHealth > 78 ? 'warning' : 'critical';
      updates.push({
        type: 'clients',
        id: clientId,
        data: {
          currentLoad: randInt(35, 210),
          health: clientHealth,
          status: clientStatus,
          alarmCount: clientStatus === 'critical' ? randInt(1, 3) : randInt(0, 1),
        },
      });

      pickSome(EQUIPMENT_TYPES, 2).forEach((eqType) => {
        const eqId = `${clientId}-${eqType}`;
        const health = randInt(70, 100);
        const status = health > 90 ? 'healthy' : health > 75 ? 'warning' : 'critical';
        updates.push({
          type: 'equipment',
          id: eqId,
          data: {
            currentLoad: randInt(0, 100),
            health,
            status,
            lastUpdated: new Date().toISOString(),
            alarm: status === 'critical',
          },
        });
      });
    });
  });

  return updates;
}
