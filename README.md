# About

Simple cli tool for publishing sequences of mqtt's commands

# Installation

```shell
$ git clone https://github.com/w111zard/mqttify
$ cd mqttify
$ npm i
$ npm link
```

# Usage

1. Create .json file with such structure

```json
[
  {
    "topic": "/events/hardware",
    "message": {
      "controller": "001",
      "signal": "on"
    }
  }
]
```

2. Run the program with the specified file

```shell
$ mqttify commands.json
```

When you start program it will execute your first MQTT command. Then you
must press any key to execute the next one. If you want to quit you must
press 'q' key

