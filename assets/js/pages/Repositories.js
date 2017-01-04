/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, {Component} from 'react'
import { Link } from 'react-router'
import RegistryNames from './../util/RegistryNames'
import RegistryProviderIcons from './../util/RegistryProviderIcons'
import Btn from './../components/Btn'
import Msg from './../components/Msg'
import Loader from './../components/Loader'
import BtnGroup from './../components/BtnGroup'
import ConvertTimeFriendly from './../util/ConvertTimeFriendly'

export default class Repositories extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.context.actions.listRepos();
	}
	toAddRepo(){
		this.context.router.push('/new-repository');
	}
	renderRepos(){
		let filteredRepos = this.context.state.repos.filter((repo) => {
			if(!this.context.state.reposFilterQuery) return true;

			return JSON.stringify(repo).indexOf(this.context.state.reposFilterQuery) > -1
		});

		if(!filteredRepos.length) {
			return this.renderNoRepositories();
		}

		return (
			<div className="RepoList FlexColumn">
				{filteredRepos.map(this.renderRepoItem.bind(this))}
			</div>
		);
	}
	renderRepoItem(repo, index){
		return (
			<Link to={`/repository/${repo.id}`}  key={index}>
			<div className="Flex1 RepoItem FlexColumn">
				<div className="Inside FlexRow">
					<img className="ProviderIcon"
					     src={RegistryProviderIcons(repo.provider)}/>
					<div className="Flex1 FlexColumn">
						<span className="RepoName">{repo.name}</span>
						<span className="RepoProvider">{RegistryNames[repo.provider]}</span>
					</div>
					{this.renderRepoItemDetails(repo)}
					<div className="FlexColumn" style={{flex: '0.45', alignItems: 'flex-end', paddingRight: '7px', justifyContent: 'center'}}>
						<span className="LastWebhookStatus">Success</span>
					</div>
				</div>
			</div>
			</Link>
		);
	}
	renderRepoItemDetails(repo){
		let lastEvent = repo.lastEvent
		if(!lastEvent) {
			return (
				<div className="Flex2 FlexColumn UnknownDetails">
					Retrieving repository details..
				</div>
			);
		}

		let friendlyTime = (lastEvent.eventTime) ? ConvertTimeFriendly(lastEvent.eventTime) : 'Unknown';
		return (
			<div className="Flex2 FlexColumn">
				<div className="FlexRow AlignCenter">
					<span className="LastPushed">Pushed image <span className="LightBlueColor">{repo.name}</span></span>
					<span className="Label">&nbsp;&ndash;&nbsp;{friendlyTime}</span>
				</div>
				<div className="FlexRow">
					{lastEvent.imageTags.map((tag, index) => {
						return (
							<span className="Tag" key={index}>{tag}</span>	
						);
					})}
				</div>
			</div>
		);
	}
	renderSearchRepos(){
		return (
			<input className="BlueBorder Search" 
			       placeholder="Search"
				   onChange={(e) => this.context.actions.filterRepos(e, false)}
			/>
		);
	}
	renderLegend(){
		return (
			<div className="ReposLegend">
				<div style={{flex: '1.105'}}>Repository</div>
				<div className="Flex2">Last event</div>
				<div>Last webhook status</div>
			</div>
		);
	}
	renderRepositories(){
		return (
			<div className="ContentContainer">
				<div className="PageHeader">
					<h2>
						{`${this.context.state.repos.length} Repositories`} 
					</h2>
					<div className="FlexRow">
						<div className="Flex1">
							<Link to="/new-repository">
								<BtnGroup buttons={[{icon: 'icon icon-dis-repo', toolTip: 'Add Repository'}]} />
							</Link>
						</div>
					</div>
				</div>
				<div>
					{this.renderSearchRepos()}
					{this.renderLegend()}
					{this.renderRepos()}		
				</div>
			</div>
		);
	}
	renderNoRepositories(){
		let buttons = [
			
		];
		return (
			<div className="ContentContainer">
				<div className="NoContent">
					<h3>
						You have no repositories to monitor
					</h3>		
					<Btn className="LargeBlueButton"
						 onClick={() => this.toAddRepo()}
						 text="Add Repository"
						 canClick={true} />
				</div>
			</div>
		);

	}
	render() {
		if(this.context.state.reposXHR) {
			return (
				<div className="PageLoader">
					<Loader />
				</div>
			);
		} else if(this.context.state.repos.length) {
			return this.renderRepositories()
		} else {
			return this.renderNoRepositories();
		}
	}
}

Repositories.childContextTypes = {
    actions: React.PropTypes.object,
    state: React.PropTypes.object,
    router: React.PropTypes.object
};

Repositories.contextTypes = {
    actions: React.PropTypes.object,
    state: React.PropTypes.object,
    router: React.PropTypes.object
};