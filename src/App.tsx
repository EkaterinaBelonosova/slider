import React, { Component } from 'react'
import * as RB from 'react-bootstrap'

import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//import { apiFetch } from './function'

type jsonData = {
  id: number,
  title: string,
  description: string,
  img: string
}
type AppState = {
  value: number,
  fetching: boolean,
  slides: any [],
  dataSlide: jsonData [],
  error: any,
  scroll: boolean
}
export default class App extends React.Component<{}, AppState> {
  private myRef: any;
	constructor(props: {}) {
    super(props)
		this.state = {    
      value: 0,
      fetching: false,
      slides: [],
      dataSlide: [],
      error: null,
      scroll: false
    }
  }
  componentDidMount() {
    this.getData();
    //this.toCardList();
	}
  getData = () => {
    //fetch("https://app.fakejson.com/q/W5NF5n0d?token=NZNDuadWK4Fe9NO0_c28Mg")
    fetch("http://localhost:3001/json.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            fetching: true,
            dataSlide: result
          });
        },
        (error) => {
          this.setState({
            fetching: true,
            error
          });
        }
      )	
  }
  toCardList = () => {
    let list: any = []
		this.state.dataSlide.forEach((card, index) => {	
			list.push((this.toTemplateCard(card, index)))			
    });
		return list;
  }
  toTemplateCard = (data:jsonData, index:number) => {
    var scrollText = this.state.scroll;
    console.log(scrollText);
    return (
      <RB.Card key={index} style={{ width: '90rem' }}>
          <RB.Card.Body>
            <RB.Card.Title>{data.title}</RB.Card.Title>
            <RB.Card.Text style={{textAlign: "center"}}>
              <RB.Card.Img variant="top" src={data.img} style={{width: "100px"}}/>
            </RB.Card.Text>
            <RB.Card.Text  ref={this.myRef} className={(scrollText) ? "text text-open" : "text"}>
              {data.description}
            </RB.Card.Text>
            <p className={(scrollText) ? "text-open toggle" : "toggle"}></p>
            <RB.Button variant="outline-secondary" onClick={() => this.setState({scroll: !scrollText})}>
              {(scrollText) ? "Свернуть" : "Развернуть"}
            </RB.Button> 
          </RB.Card.Body> 
                 
      </RB.Card>
    )
  }
	render() {
		return (
      <RB.Container>
        <RB.Row>
            <RB.Col>
              <Carousel
              value={this.state.value}
              slides={this.toCardList()}
              onChange={(e:any) => this.setState({ value: e.target ? e.target.value : e })}
              />
              <Dots value={this.state.value} onChange={(e:any) => this.setState({ value: e.target ? e.target.value : e })} number={this.toCardList().length} />
            </RB.Col>            
        </RB.Row>
      </RB.Container>
		)
	}
}


