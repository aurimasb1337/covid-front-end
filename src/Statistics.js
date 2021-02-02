import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CountryDropdown } from 'react-country-region-selector';
class Statistics extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: {
      labels: [],
      datasets: [
        {
          backgroundColor: 'rgba(75,192,192,0.4)',
          label: 'Cases',
          data: []
        },
        {
          backgroundColor: 'rgba(255,84,71,0.9)',
          label: 'Deaths',
          data: []
        }
      ]
    },
    country:"Lithuania"
  };

  componentDidMount() {
    this.getCovidData(this.state.country);
  }
    getCovidData(val){
      console.log(val);
      axios.get(`http://localhost:8080/api/`+val).then((res) => {
        const cases = {};
        const deaths = {};
  
        res.data.map((record) => {
          if (record.indicator === 'cases') cases[record.year_week] = record.cumulative_count;
          else if (record.indicator === 'deaths') deaths[record.year_week] = record.cumulative_count;
        });
  
        const weeks = [];
        const deathsArray = [];
        const casesArray = [];
        Object.keys(cases).forEach((year_week) => {
          weeks.push(year_week);
          casesArray.push(cases[year_week]);
          deathsArray.push(deaths[year_week]);
        });
  
        const newData = {
          labels: [ ...weeks ],
          datasets: [
            {
              backgroundColor: 'rgba(75,192,192,0.4)',
              label: 'Cases',
              data: [ ...casesArray ]
            },
            {
              backgroundColor: 'rgba(255,84,71,0.9)',
              label: 'Deaths',
              data: [ ...deathsArray ]
            }
          ]
        };
        this.setState({ data: { ...newData } });
        // console.log(deathsArray);
        // console.log(weeks);
        // console.log(casesArray);
      });
    }


     changeHandler = value => {
       this.setState({
         country: value
       })
      this.getCovidData(value)
    }

  render() {
    return (
      <div>
        <h1>Covid Tracker</h1>
        <CountryDropdown
          value={this.state.country}
          onChange={(val) => this.changeHandler(val)} />
        <Line data={this.state.data} options={{}} width={100} height={40} />
      </div>
    );
  }
}

export default Statistics;
