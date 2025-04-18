/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSensorsData = /* GraphQL */ `
  subscription OnCreateSensorsData(
    $device_id: String
    $timestamp: Int
    $temperature: Float
    $humidity: Float
    $battery_voltage: Float
  ) {
    onCreateSensorsData(
      device_id: $device_id
      timestamp: $timestamp
      temperature: $temperature
      humidity: $humidity
      battery_voltage: $battery_voltage
    ) {
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
export const onUpdateSensorsData = /* GraphQL */ `
  subscription OnUpdateSensorsData(
    $device_id: String
    $timestamp: Int
    $temperature: Float
    $humidity: Float
    $battery_voltage: Float
  ) {
    onUpdateSensorsData(
      device_id: $device_id
      timestamp: $timestamp
      temperature: $temperature
      humidity: $humidity
      battery_voltage: $battery_voltage
    ) {
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
export const onDeleteSensorsData = /* GraphQL */ `
  subscription OnDeleteSensorsData(
    $device_id: String
    $timestamp: Int
    $temperature: Float
    $humidity: Float
    $battery_voltage: Float
  ) {
    onDeleteSensorsData(
      device_id: $device_id
      timestamp: $timestamp
      temperature: $temperature
      humidity: $humidity
      battery_voltage: $battery_voltage
    ) {
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
