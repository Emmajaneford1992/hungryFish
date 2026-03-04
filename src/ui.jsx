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
        };
    }

    handleGuppyButton() {
        const { numOfFish, money } = this.state;
        if (money >= 100) {
            this.setState({ numOfFish: numOfFish + 1, money: money - 100 });
        }
        this.$game.increaseFish();
    }

    increaseMoney() {
        const { money } = this.state;
        this.setState({ money: money + 15 });
    }

    feedFish() {
        const { money } = this.state;
        this.setState({ money: money - 5 });
    }

    render() {
        const { money } = this.state;
        return (
            <>
                {/* <section className="UI">
                    <div className="shop">
                        <button className="guppy" onClick={this.handleGuppyButton}>
                            <img src="" />
                            <p>£100</p>
                        </button>
                        <button className="foodUpgrade">
                            <img src="" />
                            <p>£200</p>
                        </button>
                        <button className="foodIncrease">
                            <img src="" />
                            <p>£200</p>
                        </button>
                        <button className="egg">
                            <img src="" />
                            <p>£500</p>
                        </button>
                    </div>
                    <div className="moneyUI">
                        <p>Money</p>
                        <p className="money">{`£${money}`}</p>
                    </div>
                    <div className="Level">
                        <p>Level 1</p>
                        <div className="buttons">
                            <button className="pauseButton">||</button>
                        </div>
                    </div>
                </section> */}
                <Game
                    className="game"
                    ref={(el) => { this.$game = el; }}
                    state={this.state}
                    increaseMoney={this.increaseMoney}
                    feedFish={this.feedFish}
                />
            </>
        );
    }
}

export default UI;