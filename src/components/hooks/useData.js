import React, { Component, createContext, useContext } from "react";

const AppContext = createContext({ data: {}, dispatch: (_) => {} });

export class DataProvider extends Component {
  // init = this.props.init;

  constructor(props) {
    super(props);
    const { init } = this.props;

    this.init = init;
    this.state = { ...init, isMounted: false };
    this.dispatch = this.dispatch.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    const { storageListener = false } = this.props;
    this.setState({ ...this.getItem(), isMounted: true });
    if (storageListener) {
      window.addEventListener("storage", () => {
        this.setState(this.getItem());
      });
    }
  }

  componentWillUnmount() {
    const { storageListener = false } = this.props;
    if (storageListener) {
      window.removeEventListener("storage", () => {
        this.setState(this.getItem());
      });
    }
  }

  getItem() {
    try {
      const data = localStorage.getItem("data");
      if (data) return JSON.parse(data);
      this.persist(this.init);
      return this.init;
    } catch (e) {
      return this.init;
    }
  }

  persist = (payload) => {
    try {
      if (localStorage) {
        localStorage.setItem("data", JSON.stringify(payload));
      }
    } catch (e) {
      return;
    }
  };

  updateState(data) {
    this.setState((p) => ({ ...p, ...data }));
    this.persist({ ...this.state, ...data });
  }

  dispatch(payload) {
    if (payload === "clear") {
      this.updateState(this.init);
    } else {
      this.updateState(payload);
    }
  }

  render() {
    const { isMounted } = this.state;
    const { children } = this.props;
    return (
      <AppContext.Provider
        value={{ data: this.state, dispatch: this.dispatch }}
      >
        {isMounted && children}
      </AppContext.Provider>
    );
  }
}

// Explore the possibility of mounting and
// removing contexts to enable multi store support
// by changing DataProviders context type
// Possible drawbacks are: mixture of contexts since there's a clear way
// no clear way to change the DataProvider's state and to change the key
// to persist the store with. Ideally each store should have a corresponding
// key in localstorage.
export default function useData() {
  const { data, dispatch } = useContext(AppContext);

  return {
    data: data,
    dispatch: (_) => dispatch(_),
  };
}

export function connectData(Comp) {
  const ConnectData = (props) => {
    const { data, dispatch } = useData();

    return <>{<Comp {...props} data={data} dispatch={dispatch} />}</>;
  };

  return ConnectData;
}
