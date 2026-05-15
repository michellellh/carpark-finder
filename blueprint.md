# Singapore Carpark Finder

## Overview

This is a web application that helps users find available carparks in Singapore. It displays carparks on a map, allows users to search for carparks by address, and sort them by distance or the number of available lots. The application provides real-time data on lot availability and includes information on gantry height and carpark type.

## Features

- **Live Carpark Availability:** Fetches real-time data from the Data.gov.sg API to show the number of available lots.
- **Interactive Map:** Displays carparks on an interactive map. Users can click on a carpark to view more details.
- **Search and Sort:** Users can search for carparks by address and sort the results by distance from their current location or by the number of available lots.
- **Gantry Height Information:** Displays the gantry height for each carpark, helping drivers of taller vehicles find suitable parking.
- **Carpark Type:** Shows the type of carpark (e.g., MULTI-STOREY CAR PARK, SURFACE CAR PARK).
- **Responsive Design:** The application is designed to be used on both desktop and mobile devices.

### New Features

- **Price Information:** The app now displays a simulated price for each carpark.
- **Favorites:** You can now save and manage your favorite carparks.
- **Vehicle Height Filter:** The main search page now includes a direct-input field for vehicle height, allowing users to filter carparks based on their vehicle's height.
- **Vehicle Profiles:** You can now create and manage vehicle profiles in the "Vehicles" tab for your convenience.

## Data Sources

- **Static Carpark Data:** `public/Carpark_gantryheight.csv` - This file contains a list of carparks with their addresses, gantry heights, carpark types, and SVY21 coordinates.
- **Live Availability Data:** `https://api.data.gov.sg/v1/transport/carpark-availability` - This API provides real-time information on the number of available lots for each carpark.

## Technical Details

- **Framework:** React (Vite)
- **UI Library:** Material-UI (MUI)
- **Map:** Leaflet with React-Leaflet
- **Coordinate Conversion:** `svy21-wgs84` library is used to convert SVY21 coordinates to WGS84 (latitude and longitude).

## Current Plan

- Replaced the vehicle profile dropdown with a direct-input field for vehicle height on the main search page.
- Corrected the usage of `inputProps` in `src/pages/Home.tsx` and `src/components/VehicleProfiles.tsx` to resolve a React warning.
