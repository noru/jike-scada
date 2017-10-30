# Design doc

### Target

To have a framework agnostic `data ` to `svg` mapping component.

### Tech

- rxjs
- typescript
- rollup

### Design

- JScada

  *Exposed interface to end user, take options, and orchestrate internal components*


- Adaptor

  *Interface of data sources, based on Observable*

  **Implemented Adaptors:**

  - HttpAdaptor (long polling)
  - WebSocket
  - MqttAdaptor

- Mounter

  *Take in data from observble, redirect to action by tag type*

- Action

  *Take in an HtmlElement and data to consume, perform side effect, namely update svg content, like text, fill, stroke...*

  **Supported action**

  - text update
  - fill
  - stroke
  - opacity/visibility

  **Planned**

  - rotate
  - scale
  - offset

TODO:

- send message to data source
- documentation
- live example
- support more means to manipulate svg elements
- fix bugs