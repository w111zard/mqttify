import EventEmitter from "events";
import blessed from 'blessed';
import RequestGroup from "./requests-group";
import requestsGroup from "./requests-group";
import Operation from "./operation";

export default class Graphics extends EventEmitter {
  private readonly screen: blessed.Widgets.Screen;
  private leftList: blessed.Widgets.ListElement;
  private infoBox: blessed.Widgets.BoxElement;
  private rightBottomList: blessed.Widgets.ListElement;
  private selectedGroup: requestsGroup | null = null;

  constructor(
    private readonly requestGroups: RequestGroup[],
    private readonly history: Operation[],
  ) {
    super();
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'mqttify'
    });

    this.leftList = blessed.list({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '30%',
      height: '100%',
      keys: true,
      mouse: true,
      border: {type: 'line'},
      style: {
        fg: 'white',
        bg: 'black',
        border: {fg: 'white'},
        selected: {bg: '#34eb5e'}
      },
      items: this.requestGroups.map(g => g.name),
    });


    this.infoBox = blessed.box({
      parent: this.screen,
      top: 0,
      left: '30%',
      width: '70%',
      height: '50%',
      border: {type: 'line'},
      style: {
        fg: 'white',
        bg: 'black',
        border: {fg: 'white'}
      },
    });

    this.rightBottomList = blessed.list({
      parent: this.screen,
      top: "50%",
      left: '30%',
      width: '70%',
      height: '50%',
      border: {type: 'line'},
      style: {
        fg: 'white',
        bg: 'black',
        border: {fg: 'white'}
      },
    });
  }

  renderMainScreen() {
    this.screen.key(['q', 'C-c'], () => process.exit(0));

    this.screen.key(['escape'], () => {
      if (this.selectedGroup) {
        this.selectedGroup = null;
        this.leftList.setItems(this.requestGroups.map(g => g.name));
        this.screen.render();
      }
    });

    this.leftList.on('select', (item, index) => {
      if (!this.selectedGroup) {
        this.selectedGroup = this.requestGroups[index];
        this.leftList.setItems(this.selectedGroup.requests.map(r => r.name));
        this.infoBox.setContent(JSON.stringify(this.selectedGroup.requests[0].data, null, 2));
        this.screen.render();
        return;
      }

      // Sending request
      const selectedRequest = this.selectedGroup.requests[index];
      this.emit('send', selectedRequest);

      this.history.push(new Operation(selectedRequest.name));
      const listHeight = Number(this.rightBottomList.height);
      this.rightBottomList.setItems(this.history.slice(-(listHeight - 2)).map(o => `${o.id} ${o.name}`));

      // Update cursor position to the next item
      if (index + 1 === this.selectedGroup.requests.length) {
        this.leftList.select(0);
      }
      else {
        this.leftList.select(index + 1);
      }

      this.screen.render();
    });

    this.leftList.on('select item', (item, index) => {
      if (this.selectedGroup) {
        const selectedRequest = this.selectedGroup.requests[index];
        this.infoBox.setContent(JSON.stringify(selectedRequest.data, null, 2));
        this.screen.render();
      }
    });

    this.leftList.focus();
    this.screen.render();
  }
}