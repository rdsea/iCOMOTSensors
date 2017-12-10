package ac.at.tuwien.dsg;

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ac.at.tuwien.dsg.functions.AggregatorFunction;
import ac.at.tuwien.dsg.functions.JSONMapper;
import ac.at.tuwien.dsg.functions.TimestampAndWatermarkGenerator;
import ac.at.tuwien.dsg.models.AlarmWindow;
import ac.at.tuwien.dsg.models.AlarmWindowSerializer;
import ac.at.tuwien.dsg.models.BTSAlarm;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSink;
import org.apache.flink.streaming.connectors.rabbitmq.common.RMQConnectionConfig;


public class StreamingJob {

	public static void main(String[] args) throws Exception {
        ConfigParser config = new ConfigParser(args[0]);

        final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
                .setHost(config.rabbitHost)
                .setVirtualHost(config.rabbitvHost)
                .setUserName(config.rabbitUser)
                .setPassword(config.rabbitPassword)
                .setPort(config.rabbitPort)
                .build();

		// set up the streaming execution environment
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		MqttSource source = new MqttSource(config.mqttUri, config.mqttClientId, config.mqttTopics);
        DataStream<String> mqttStream = env.addSource(source);

        JSONMapper jsonMapper = new JSONMapper();
        // convert the json string to POJO
        // use the reading time as a watermark
        DataStream<BTSAlarm> alarmStream = mqttStream
                .flatMap(jsonMapper)
                .assignTimestampsAndWatermarks(new TimestampAndWatermarkGenerator());

        DataStream<AlarmWindow> alarmWindowStream = alarmStream
                .timeWindowAll(Time.seconds(config.window), Time.seconds(config.window/2))
                .apply(new AggregatorFunction());

        alarmWindowStream.addSink(new RMQSink<>(connectionConfig, config.rabbitTopic, new AlarmWindowSerializer()));

		// execute program
		env.execute("BTS alarm window streaming job");
	}
}
