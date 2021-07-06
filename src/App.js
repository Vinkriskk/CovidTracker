import './App.css';
import styled from "styled-components";
import React from "react";

const Worldmap = require('react-svg-worldmap').WorldMap;

const Background = styled.div `
  width: 100%;
  background: #393939;
  color: white;
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`

const Header = styled.div `
  display: flex;
  background: #181818;
  width: 100%;
  height: 50px;
`

const HeaderTitle = styled.h2 `
  font-family: 'MuseoModerno';
  margin: auto;
  color: white;
  display: flex;
`

const HeaderIcon = styled.i `
  font-style: normal;
  font-size: 40px;
  color: red;
  font-family: 'Material Icons';
  margin-top: auto;
  margin-bottom: auto;
`

const WorldmapWrapper = styled.div `
  width: 640px;
  height: 480px;
  margin-right: 30px;
`

const WorldmapInfo = styled.div `
  background: #181818;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 2px;
  border: 1px solid;
  height: fit-content;
  margin: auto 0px;
  width: 200px;
`

const InfoHeader = styled.span `
  margin: 10px auto;
  color: white;
  text-align: center;
`

const InfoDetails = styled.li `
  color: white;
  font-size: 13px;
  margin-bottom: 10px;
`

const InfoButton = styled.div `
  width: 100px;
  border: 1px solid;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
`

const InfoButtonSpan = styled.span `
  color: white;
  font-size: 12px;
  margin: auto;
`

const Selector = styled.div `
  background: #181818;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  width: 30%;
  padding: 5px;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
`

const SelectorItems = styled.i `
  font-family: 'Material Icons';
  font-size: 40px;
  font-style: normal;
  border-radius: 12px;
  cursor: pointer;

  margin-left: auto;
  margin-right: auto;
`

const HorizontalRule = styled.hr `
  width: 100%;
`

const InfoDetailsWrapper = styled.div `
  display: flex;
  flex-direction: column;
  margin: 0px auto;
`

const InfoDetailsList = styled.ul `
  padding: 0 0 0 15px;
  width: 80%;
`

const DataWrapper = styled.div `
  width: 90%;
  background: black;
  color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid;
`

const DataHeader = styled.h3 `
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
`

const DataNotice = styled.span `
  margin-left: auto;
  margin-right: auto;
  font-size: 15px;
  margin-bottom: 8px;
`

const DataTable = styled.table `
  width: 100%;
  border: 1px solid;
`

const DataTableHeader = styled.th `
  border: 1px solid;
`

const DataTableRow = styled.tr `
  border: 1px solid;
`

const DataTableData = styled.td `
  border: 1px solid;
  text-align: center;
`

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      worldMap: <Worldmap size="xl" data={[]} backgroundColor="transparent" strokeOpacity="0.5"/>,
      filterBy: "deaths",
      countryData: {
        "global": {
          totalDeaths: 0,
          newDeaths: 0,
          totalConfirmed: 0,
          newConfirmed: 0,
          totalRecovered: 0,
          newRecovered: 0
        }
      },
      currentCountry: "global",
      currentCountryCode: "global",
      dataDeaths: [],
      dataRecovered: [],
      dataConfirmed: [],
      currentDataRow: <></>
    }
  }

  showCountryOnClick = (e, countryName, isoCode, val, prefix, suffix) => {
    this.setState({currentCountry: countryName, currentCountryCode: isoCode}, () => {
      if (isoCode === "global") {
        return
      }

      let nowDate = new Date()
      const pastDate = nowDate.getDate() - 7

      const pastDateISO = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${pastDate}T00:00:00Z`
      const nowDateISO = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}T00:00:00Z`

      fetch(`https://api.covid19api.com/total/country/${this.state.countryData[isoCode]["country"]}/status/${this.state.filterBy}?from=${pastDateISO}&to=${nowDateISO}`, {
        method: "GET"
      }).then(resp => {
        return resp.json()
      }).then(body => {
        this.setState({
          currentDataRow: 
          <>
            {body.map((obj, idx) => {
              const referredDate = new Date(obj.Date)
              const getDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
              const getMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
              return (
                <DataTableRow key={this.state.currentCountryCode + "-" + idx}>
                  <DataTableData>{`${getDay[referredDate.getDay()]}, ${referredDate.getDate()} ${getMonth[referredDate.getMonth()]} ${referredDate.getFullYear()}`}</DataTableData>
                  <DataTableData>{obj.Status}</DataTableData>
                  <DataTableData>{obj.Cases}</DataTableData>
                </DataTableRow>
              )
            })}
          </>
        })
      })
    })
  }

  componentDidMount() {
    fetch("https://api.covid19api.com/summary", {
      method: "GET"
    }).then(resp => {
      return resp.json()
    }).then(body => {
      let dataDeaths = [], dataConfirmed = [], dataRecovered= []
      let fullDatas = {}
      body.Countries.forEach((countryObj) => {
        dataDeaths.push({
          country: countryObj.CountryCode,
          value: countryObj.TotalDeaths
        })

        dataConfirmed.push({
          country: countryObj.CountryCode,
          value: countryObj.TotalConfirmed
        })

        dataRecovered.push({
          country: countryObj.CountryCode,
          value: countryObj.TotalRecovered
        })

        fullDatas[countryObj.CountryCode] = {
          country: countryObj.Slug,
          totalDeaths: countryObj.TotalDeaths,
          newDeaths: countryObj.NewDeaths,
          totalConfirmed: countryObj.TotalConfirmed,
          newConfirmed: countryObj.NewConfirmed,
          totalRecovered: countryObj.TotalRecovered,
          newRecovered: countryObj.NewRecovered
        }
      })

      fullDatas["global"] = {
        totalDeaths: body.Global.TotalDeaths,
        newDeaths: body.Global.NewDeaths,
        totalConfirmed: body.Global.TotalConfirmed,
        newConfirmed: body.Global.NewConfirmed,
        totalRecovered: body.Global.TotalRecovered,
        newRecovered: body.Global.NewRecovered,
      }

      this.setState({
        worldMap: <Worldmap size="xl" data={dataDeaths} color="red" backgroundColor="transparent" strokeOpacity="0.5" 
          valueSuffix="deaths" valuePrefix="total" onClickFunction={this.showCountryOnClick}/>,
        dataDeaths: dataDeaths,
        dataRecovered: dataRecovered,
        dataConfirmed: dataConfirmed,
        countryData: fullDatas
      })
    }).catch(err => {
      console.log(err)
    })
  }

  changeFilter(e) {
    if (this.state.filterBy !== e.target.id) {
      let datas = []
      let color = "white"

      switch (e.target.id) {
        case "deaths":
          datas = this.state.dataDeaths
          color = "red"
          break;
        case "confirmed":
          datas = this.state.dataConfirmed
          color = "yellow"
          break;
        case "recovered":
          datas = this.state.dataRecovered
          color = "green"
          break;
        default:
          break;
      }

      this.setState({
        worldMap: <Worldmap size="xl" data={datas} color={color} backgroundColor="transparent" strokeOpacity="0.5" 
        valueSuffix={e.target.id} valuePrefix="total" onClickFunction={this.showCountryOnClick}/>,
        filterBy: e.target.id
      }, () => {
        if (this.state.currentCountryCode === "global") {
          return
        }

        let nowDate = new Date()
        const pastDate = nowDate.getDate() - 7
  
        const pastDateISO = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${pastDate}T00:00:00Z`
        const nowDateISO = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}T00:00:00Z`
  
        fetch(`https://api.covid19api.com/total/country/${this.state.countryData[this.state.currentCountryCode]["country"]}/status/${this.state.filterBy}?from=${pastDateISO}&to=${nowDateISO}`, {
          method: "GET"
        }).then(resp => {
          return resp.json()
        }).then(body => {
          this.setState({
            currentDataRow: 
            <>
              {body.map((obj, idx) => {
                const referredDate = new Date(obj.Date)
                const getDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                const getMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                return (
                  <DataTableRow key={this.state.currentCountryCode + "-" + idx}>
                    <DataTableData>{`${getDay[referredDate.getDay()]}, ${referredDate.getDate()} ${getMonth[referredDate.getMonth()]} ${referredDate.getFullYear()}`}</DataTableData>
                    <DataTableData>{obj.Status}</DataTableData>
                    <DataTableData>{obj.Cases}</DataTableData>
                  </DataTableRow>
                )
              })}
            </>
          })
        })
      })
    }
  }

  render() {
    return (
      <>
        <Header>
          <HeaderTitle>COVID<HeaderIcon>location_on</HeaderIcon>TRACKER</HeaderTitle>
        </Header>
        <Background>
          <Content>
            <WorldmapWrapper>
              {this.state.worldMap}
            </WorldmapWrapper>
            <WorldmapInfo>
              <InfoHeader>Showing {this.state.currentCountry}</InfoHeader>
              <HorizontalRule/>
              <InfoDetailsWrapper>
                <InfoDetailsList>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["newDeaths"]} newly death case</InfoDetails>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["totalDeaths"]} total death case</InfoDetails>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["newConfirmed"]} newly confirmed case</InfoDetails>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["totalConfirmed"]} total confirmed case</InfoDetails>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["newRecovered"]} newly recovered case</InfoDetails>
                  <InfoDetails>{this.state.countryData[this.state.currentCountryCode]["totalRecovered"]} total recovered case</InfoDetails>
                </InfoDetailsList>
              </InfoDetailsWrapper>
              {this.state.currentCountryCode !== "global" &&
              <InfoButton onClick={(e) => this.showCountryOnClick(e, "global", "global", 0, "", "")}>
                <InfoButtonSpan>Show global</InfoButtonSpan>
              </InfoButton>
              }
            </WorldmapInfo>
          </Content>
          <Selector>
            <SelectorItems style={{color: "red", background: this.state.filterBy === "deaths" ? "#393939" : "transparent"}} id="deaths" onClick={(e) => this.changeFilter(e)} title="Filter by death case count">report</SelectorItems>
            <SelectorItems style={{color: "yellow", background: this.state.filterBy === "confirmed" ? "#393939" : "transparent"}} id="confirmed" onClick={(e) => this.changeFilter(e)} title="Filter by confirmed case count">warning</SelectorItems>
            <SelectorItems style={{color: "green", background: this.state.filterBy === "recovered" ? "#393939" : "transparent"}} id="recovered" onClick={(e) => this.changeFilter(e)} title="Filter by recovered case count">health_and_safety</SelectorItems>
          </Selector>
          <DataWrapper>
            <DataHeader>Showing related data</DataHeader>
            <HorizontalRule/>
            {this.state.currentCountryCode === "global" ?
            <DataNotice>Please select a country to view data</DataNotice>
            :
            <DataTable>
              <DataTableRow>
                <DataTableHeader>Date</DataTableHeader>
                <DataTableHeader>Status</DataTableHeader>
                <DataTableHeader>Number of case</DataTableHeader>
              </DataTableRow>
              {this.state.currentDataRow}
            </DataTable>
            }
          </DataWrapper>
        </Background>
      </>
    )
  }
}

export default App;
