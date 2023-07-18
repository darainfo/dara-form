import { Component } from 'preact';

export default class MyComponent extends Component {
    render(props: any, state: any) {
        // props is the same as this.props
        // state is the same as this.state

        return <h1>Hello, {props.name}!</h1>;
    }
}