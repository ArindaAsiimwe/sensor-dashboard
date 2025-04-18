/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSensorsData = /* GraphQL */ `
  query GetSensorsData($device_id: String!, $timestamp: Int!) {
    getSensorsData(device_id: $device_id, timestamp: $timestamp) {
      device_id
      timestamp
      temperature
      humidity
      battery_voltage
      move_count
      field_2
      received_at
      __typename
    }
  }
`;
export const listSensorsData = /* GraphQL */ `
  query ListSensorsData(
    $filter: TableSensorsDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSensorsData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        device_id
        timestamp
        temperature
        humidity
        battery_voltage
        move_count
        field_2
        received_at
        __typename
      }
      nextToken
      __typename
    }
  }
`;
