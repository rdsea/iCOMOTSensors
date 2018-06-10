# Sample of BTS monitoring data
This is about aggregated data. You can use the station_id to split data into
different small data sets:

    - all data with the same station id comes from one station
    - you can use alarm_id or parameter_id to identify sensors

therefore, based on station id, alarm_id, parameter_id, you can emulate
various sensors from different stations. For example:

     - using alarm*.csv: you emulate various stations, in which various alarm sensors (using alarm id) sending alarm information about parameters (param id) whose values are above the threashold.
     - using param*.csv: you emulate various stations, in which various sensors measuing different parameters


Data is provided by BachPhu, a company developing IoT solution in Vietnam
