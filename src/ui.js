
import { h, Component } from 'preact';
import Game from './game';

class UI extends Component {
    constructor(props) {
        super(props);
        this.handleGuppyButton = this.handleGuppyButton.bind(this);
        this.increaseMoney = this.increaseMoney.bind(this);
        this.feedFish = this.feedFish.bind(this);
        
        this.$game;

        this.state = {
            numOfFish: 1,
            maxFood: 3,
            money: 200
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }   


    handleGuppyButton(){
        console.log('handle guppy button');
        const {numOfFish, money} = this.state;
        if(money >= 100){
            this.setState({numOfFish: numOfFish + 1, money: money - 100});
        }
        this.$game.increaseFish();
    }

    increaseMoney(){
        const {numOfFish, money} = this.state;
        this.setState({ money: money + 15});
    }

    feedFish(){
        const  { money} = this.state;
        this.setState({ money: money - 5});
    }


    render(props, state) {
        const { money} = this.state;
        console.log('money', money);
        return (
            <>
                <section class="UI">
                    <div class="shop">
                        <button class="guppy" onClick={this.handleGuppyButton}>
                            <img src=""/>
                            <p>£100</p>
                        </button>
                        <button class="foodUpgrade">
                            <img src=""/>
                            <p>£200</p>
                        </button>
                        <button class="foodIncrease">
                            <img src=""/>
                            <p>£200</p>
                        </button>
                        <button class="egg">
                            <img src=""/>
                            <p>£500</p>
                        </button>
                    </div>
                    <div class="moneyUI">
                    <p>Money</p>
                    <p class="money">{ `£${money}` }</p>
                    </div>
                    <div class="Level">
                        <p>Level 1</p>
                        <div class="buttons">
                            <button class="pauseButton">||</button>
                        </div>
                    </div>
                </section>
                <Game class="game" ref={(el) => { this.$game = el; }} state={this.state} increaseMoney={this.increaseMoney} feedFish={this.feedFish}/>
            </>
        );
    }
}

export default UI;

