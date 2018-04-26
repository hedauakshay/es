import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Tab, Icon, Rating } from 'semantic-ui-react'
import FileViewer from 'react-file-viewer';
import elasticsearch from "elasticsearch";
import ElasticContent from '../classes/elasticsearch';
import { Composite } from 'react-composite';
import ReactNotify from 'react-notify';
import Chip from 'material-ui/Chip';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import PDF from 'react-pdf-js';
import InfiniteScroll from 'react-infinite-scroller';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import TextField from 'material-ui/TextField';
import './App.css';



let obj = new ElasticContent();
const file = 'C:/NodeProj/HelloWorld/ElasticReactDemo/src/components/Forums1.png'
const type = 'png'
const styles = {
	chip: {
		margin: 4,
	},
	wrapper: {
		display: 'flex',
		flexWrap: 'wrap',
		bottom: '10px'
	},
	block: {
		maxWidth: 250,
	},
	checkbox: {
		marginBottom: 16,
	},
	modalStyle: {
		padding: '20px 0 20px 0 '
	},
	customContentStyle: {
		width: '70%',
		maxWidth: 'none',
	},
	container: {
		textAlign: 'center',
		height: '10px'
	},
	refresh: {
		display: 'inline-block',
		position: 'relative',
		textAlign: 'center'
	}
};

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			results: [],
			term: '',
			type: [],
			index: [],
			nextRecords: 10,
			resultCount: 0,
			morePage: false
		};  
		this.inputAction = this.inputAction.bind(this);
		this.handleChange = obj.handleChange.bind(this);
		this.getData = obj.getData.bind(this);
		this.client = obj.client.bind(this);
		this.queryalldocs = obj.queryalldocs.bind(this);
		this.setType = obj.setType.bind(this);
		this.setIndex = obj.setIndex.bind(this);
		this.handleScroll = obj.handleScroll.bind(this);

	}

	inputAction = (event) => {
		const search_query = event.target.value;
		const index = this.state.index || [];
		const type = this.state.type || [];

		let myVar = this.handleChange(search_query, this.state.index, this.state.type);

		console.log("Value from Input Action " + event.target.value);
		console.log(this.state);
	}

	render() {

		let component = (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">GAIA</h1>
				</header>
				<div className="container" style={{ paddingTop: '50px', height: '30px' }}>
					<div className="row">
						<div className="col-md-12">
							<h3 style={{ textAlign: 'center' }}>Resource Center Search</h3>
							<MuiThemeProvider>
								<TextField
									style={{ margin: '0 auto', display: 'inherit' }}
									hintText="Start Typing here to search"
									onChange={(event) => this.inputAction(event)}
								/>

							</MuiThemeProvider>
						</div>
					</div>
					<Result results={this.state.results} term={this.state.term} type={this.state.type} index={this.state.index} morePage={this.state.morePage} resultCount={this.state.resultCount} />

				</div>
			</div>

		);
		return component;
	}
}

class Result extends Component {

	constructor(props) {
		super(props);
		//this.state = { results: this.props.results, term: this.props.term };
		this.state = {
			results: [],
			term: '',
			type: [],
			index: [],
			filterID: [false, false, false, false, false, false, false, false],
			chipData: [],
			chipKEY: 0,
			morePage: false,
			open: false,
			resultCurrent: [],
			nextRecords: 10,
			resultCount: 0
		};
		this.styles = {
			chip: {
				margin: 4,
			},
			wrapper: {
				display: 'flex',
				flexWrap: 'wrap',
			},
		};
		this.inputAction = this.inputAction.bind(this);
		this.handleChange = obj.handleChange.bind(this);
		this.getData = obj.getData.bind(this);
		this.client = obj.client.bind(this);
		this.queryalldocs = obj.queryalldocs.bind(this);
		this.setType = obj.setType.bind(this);
		this.setIndex = obj.setIndex.bind(this);
		this.handleScroll = obj.handleScroll.bind(this);
		this.onDocumentComplete = this.onDocumentComplete.bind(this);
		this.onPageComplete = this.onPageComplete.bind(this);
		this.handlePrevious = this.handlePrevious.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.renderPagination = this.renderPagination.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log("NextProps Value " + nextProps)
		console.log(nextProps)
		this.setState({
			results: nextProps.results,
			term: nextProps.term,
			type: nextProps.type,
			index: nextProps.index,
			morePage: nextProps.morePage,
			resultCount: nextProps.resultCount
		});
	}

	componentDidMount() {
		console.log("wefe")
	}

	onDocumentComplete = (pages) => {
		this.setState({ page: 1, pages });
	}

	onPageComplete = (page) => {
		this.setState({ page });
	}

	handlePrevious = () => {
		this.setState({ page: this.state.page - 1 });
	}

	handleNext = () => {
		this.setState({ page: this.state.page + 1 });
	}

	renderPagination = (page, pages) => {
		console.log("In here");
		let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
		if (page === 1) {
			previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
		}
		let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
		if (page === pages) {
			nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
		}
		return (
			<nav>
				<ul className="pager">
					{previousButton}
					{nextButton}
				</ul>
			</nav>
		);
	}

	handleOpen = (result) => {
		this.setState({ open: true, resultCurrent: result });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleMainScroll = () => {
		const search_query = this.state.term || '';
		const index = this.state.index || [];
		const type = this.state.type || [];
		//console.log("handleScroll executed " + index + " --> " + type)

		setTimeout(() => {
			let myvar = this.handleScroll(search_query, this.state.index, this.state.type, this.state.nextRecords);
			console.log("handleScroll executed " + index + " --> " + type)
			//this.setState({ test: false });
		}, 400);
	};

	inputAction = (event, checkID, chipVal) => {

		const checkVal = this.state.filterID[checkID];
		const indexVal = event.target.value;
		const index = this.state.index || [];
		this.chipData = this.state.chipData;
		this.chipKEY = this.state.chipKEY;
		console.log("checkVal " + checkVal);
		this.mainFilter = this.state.filterID;
		this.mainFilter[checkID] = !checkVal;
		this.setState(() => {
			return {
				filterID: this.mainFilter,
			};
		});
		if (!checkVal) {
			index.push(indexVal);
			this.chipData.push({ key: this.chipKEY, label: chipVal, search_label: indexVal, filterVal: checkID });
		} else {
			var i = index.indexOf(indexVal);
			index.splice(i, 1);
			const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(chipVal);
			this.chipData.splice(chipToDelete, 1);
		}

		this.setState({ chipData: this.chipData, chipKEY: ++this.chipKEY });
		const term = this.state.term || '';
		const type = this.state.type || [];
		let myVar = this.handleChange(term, index, type);
		console.log("Value from Result inputActionn " + term + " : " + index + " : " + type + " Checked Val " + checkVal);
	}

	inputSubAction = (event, checkID, chipVal) => {

		const checkVal = event.target.checked;
		const typeVal = event.target.value;

		const term = this.state.term || '';
		const index = this.state.index || [];
		const type = this.state.type || [];

		this.chipData = this.state.chipData
		this.chipKEY = this.state.chipKEY
		console.log("checkVal " + checkVal);
		this.mainFilter = this.state.filterID;
		this.mainFilter[checkID] = checkVal;
		this.setState(() => {
			return {
				filterID: this.mainFilter,
			};
		});

		if (checkVal) {
			type.push(typeVal);
			this.chipData.push({ key: this.chipKEY, label: chipVal, search_label: typeVal, filterVal: checkID });
		} else {
			var i = type.indexOf(typeVal);
			type.splice(i, 1);
			const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(chipVal);
			this.chipData.splice(chipToDelete, 1);
		}

		this.setState({ chipData: this.chipData, chipKEY: ++this.chipKEY });
		let myVar = this.handleChange(term, index, type);
		console.log("Value from Result inputSubAction " + term + " : " + index + " : " + type + " Checked Val " + checkVal);
	}

	showNotification = (color, articleID) => {
		if (color == "success") {
			this.refs.notificator.success("Following ", "Article ID: " + articleID, 4000);
		} else if (color == "info") {
			this.refs.notificator.info("Liked ", "Article ID: " + articleID, 4000);
		} else {
			this.refs.notificator.error("Bookmarked ", "Article ID: " + articleID, 4000);
		}
	};

	handleChip = (key, search_label, filterVal) => {
		console.log("Handlechip triggered" + filterVal + " " + search_label);

		if (search_label == 'error&soln' || search_label == 'productdoc' || search_label == 'trendingissue' || search_label == 'faq' || search_label == 'supportknowledge') {
			const term = this.state.term || '';
			const index = this.state.index || [];
			const type = this.state.type || [];
			var i = type.indexOf(search_label);
			type.splice(i, 1);
			let myVar = this.handleChange(term, index, type);
		} else {
			const term = this.state.term || '';
			const type = this.state.type || [];
			const index = this.state.index;
			var i = index.indexOf(search_label);
			index.splice(i, 1);
			let myVar = this.handleChange(term, index, type);
		}
		this.chipData = this.state.chipData;
		const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
		this.chipData.splice(chipToDelete, 1);

		this.mainFilter = this.state.filterID;
		this.mainFilter[filterVal] = !this.mainFilter[filterVal];
		this.setState(() => {
			return {
				filterID: this.mainFilter,
				chipData: this.chipData
			};
		});
	};

	renderChip(data) {
		return (
			<MuiThemeProvider>
				<Chip
					key={data.key}
					onRequestDelete={() => this.handleChip(data.key, data.search_label, data.filterVal)}
					style={this.styles.chip}
				>
					{data.label}
				</Chip>
			</MuiThemeProvider>
		);
	}

	render() {

		const results = this.state.results || [];
		const term = this.state.term || '';
		const resultCurrent = this.state.resultCurrent || '';

		let pagination = null;
		if (this.state.pages) {
			pagination = this.renderPagination(this.state.page, this.state.pages);
		}

		const actions = [
			<FlatButton
				label="Close"
				primary={true}
				onClick={this.handleClose}
			/>
		];

		//console.log('I was triggered during render 1')
		//console.log(results)
		return (
			<div style={{ paddingTop: '50px' }}>

				<div className="container" style={{ width: '100%' }}>
					<div className="row">
						<div className="col-md-3">

							<a data-toggle="collapse" href="#collapse0" className="btn btn-success btn-block">Filter Results</a>
							<div className="panel panel-default">
								<div className="panel-heading">
									<a data-toggle="collapse" href="#collapse0">
										<i className="indicator fa fa-caret-down" aria-hidden="true"></i> Category
									</a>
								</div>
								<div id="collapse0" className="panel-collapse collapse">
									<div className="panel-body">
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Knowledge"
														checked={this.state.filterID[0]}
														onCheck={(event) => this.inputAction(event, 0, "Knowledge")}
														value="knowledge"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Helpdoc"
														checked={this.state.filterID[1]}
														onCheck={(event) => this.inputAction(event, 1, "Helpdoc")}
														value="helpdoc"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<div style={styles.block}>
													<MuiThemeProvider>
														<Checkbox
															label="LMS Classes"
															checked={this.state.filterID[2]}
															onCheck={(event) => this.inputAction(event, 2, "LMS Classes")}
															value="lmsclass"
															style={styles.checkbox}
														/>
													</MuiThemeProvider>
												</div>
											</div>
										</ul>
									</div>
								</div>
								<div className="panel-heading">
									<a data-toggle="collapse" href="#collapse1">
										<i className="indicator fa fa-caret-down" aria-hidden="true"></i> Sub-Category
									</a>
								</div>
								<div id="collapse1" className="panel-collapse collapse">
									<div className="panel-body">
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Support Knowledge"
														checked={this.state.filterID[3]}
														onCheck={(event) => this.inputSubAction(event, 3, "Support Knowledge")}
														value="supportknowledge"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="FAQ"
														checked={this.state.filterID[4]}
														onCheck={(event) => this.inputSubAction(event, 4, "FAQ")}
														value="faq"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Trending Issues"
														checked={this.state.filterID[5]}
														onCheck={(event) => this.inputSubAction(event, 5, "Trending Issues")}
														value="trendingissue"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Product Documentation"
														checked={this.state.filterID[6]}
														onCheck={(event) => this.inputSubAction(event, 6, "Product Documentation")}
														value="productdoc"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
										<ul className="list-group">
											<div className="checkbox">
												<MuiThemeProvider>
													<Checkbox
														label="Error & Solution"
														checked={this.state.filterID[7]}
														onCheck={(event) => this.inputSubAction(event, 7, "Error & Solution")}
														value="error&soln"
														style={styles.checkbox}
													/>
												</MuiThemeProvider>
											</div>
										</ul>
									</div>
								</div>
							</div>

							<a href="#" className="btn btn-danger btn-block btn-compose-email">Personalized</a>
							<div className="panel panel-default">
								<div className="panel-body">Followed (4)</div>
								<div className="panel-body">Bookmarks (2)</div>
							</div>
							<a href="#" className="btn btn-info btn-block btn-compose-email">Trending</a>
							<div className="panel panel-default">
								<div className="panel-body">Top 5 searhed terms</div>
								<div className="panel-body">Your Last recent search</div>
							</div>

						</div>
						<div className="col-md-9">
							<div>
								<MuiThemeProvider>
									<Dialog
										actions={actions}
										modal={false}
										open={this.state.open}
										contentStyle={styles.customContentStyle}
										onRequestClose={this.handleClose}
										autoScrollBodyContent={true}
									>
										<div style={styles.modalStyle}>

											<div className="hr" style={{paddingBottom: '10px'}} ><span><strong>{this.state.resultCurrent.articlenumber}</strong></span></div>
											<MuiThemeProvider>
												<Divider />
											</MuiThemeProvider>
											<strong><h4 dangerouslySetInnerHTML={{ __html: this.state.resultCurrent.answer_solution__c }} style={{paddingTop: '10px'}} ></h4></strong>
											<strong><h4 dangerouslySetInnerHTML={{ __html: this.state.resultCurrent.details__c }} ></h4></strong>
											<strong><h4 dangerouslySetInnerHTML={{ __html: this.state.resultCurrent.solution_details__c }} style={{paddingBottom: '10px'}} ></h4></strong>
											
											<strong><h4 id="myInput" style={{padding: '10px 0 10px'}} dangerouslySetInnerHTML={{ __html: this.state.resultCurrent.resolution__c }} className="content"></h4></strong>
											<MuiThemeProvider >
												<Divider />
											</MuiThemeProvider>
											<div style={{ textAlign: 'center', padding: '10px 0 10px' }}>
												<PDF
													file="http://www.bath.ac.uk/library/help/infoguides/ieee.pdf"
													onDocumentComplete={this.onDocumentComplete}
													onPageComplete={this.onPageComplete}
													page={this.state.page}
												/>
												{pagination}
											</div>
										</div>
									</Dialog>
								</MuiThemeProvider>
							</div>
							<div style={this.styles.wrapper}>
								{this.state.chipData.map(this.renderChip, this)}
							</div>
							<div style={{ height: '710px', overflow: 'auto' }}>
								<InfiniteScroll
									pageStart={0}
									loadMore={this.handleMainScroll}
									hasMore={this.state.morePage}
									loader={
										<div style={styles.container}>
											<Loader size='medium' active inline />
										</div>
									}
									useWindow={false}
								>
									{results.map((result) => (
										<Composite>
											<div className="well" style={{ height: '-webkit-fit-content', height: '-moz-fit-content' }}>
												<div className="media">
													<div className="media-body">
														<a href="#" style={{ color: 'black' }} onClick={() => { this.handleOpen(result._source) }}><h4 className="media-heading">Article Number: <strong>{result._source.articlenumber}</strong></h4></a>
														<p className="text-right">By {result._source.owner.Name}</p>

														<MuiThemeProvider>
															<Divider />
														</MuiThemeProvider>

														<h5>Title: <strong>{result._source.title}</strong></h5>
														<p>Product: {result._source.articletype}</p>

														<ul className="list-inline list-unstyled">
															
															<li> </li>
															<Rating maxRating={5} defaultRating={3} icon='star'  size='large' />
															<li>|</li>

															<span><Icon name='feed' className="col" size='large' /> <a href="#" style={{ color: 'black' }} onClick={() => { this.showNotification("success", result._source.articlenumber) }}>Follow</a>	</span>

															<li>|</li>

															<span><Icon name='book' className="col" size='large' /> <a href="#" style={{ color: 'black' }} onClick={() => { this.showNotification("error", result._source.articlenumber) }}>Bookmark</a>	</span>

															<li>|</li>

															<span><Icon name='like outline' className="col" size='large' /> <a href="#" style={{ color: 'black' }} onClick={() => { this.showNotification("info", result._source.articlenumber) }}>Like</a>	</span>

															<li>|</li>
															<li><span><i className="glyphicon glyphicon-calendar"></i> 2 days, 8 hours </span></li>
														</ul>
													</div>
												</div>
											</div>
										</Composite>
									))}
								</InfiniteScroll>
							</div>
						</div>
					</div>
				</div>
				<div style={{ paddingTop: '40px' }}>
					<ReactNotify ref='notificator' />
				</div>

			</div>
		);
	}

}


export default App;