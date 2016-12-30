/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, {Component} from 'react'
import Loader from './../components/Loader'
import WebhookData from './../components/WebhookData'
import isEmpty from './../util/IsEmpty'
import RegistryNames from './../util/RegistryNames'
import RepoSettings from './../components/RepoSettings'
import CenteredConfirm from './../components/CenteredConfirm'
import RepoEventTimeline from './../components/RepoEventTimeline'
import BtnGroup from './../components/BtnGroup'

export default class RepoDetailsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	componentWillMount() {
		let repoId = this.props.params.repoId

		if(isEmpty(this.context.state.reposMap)) {
			this.context.actions.toggleRepoDetailsPageXHR()
			this.context.actions.listRepos().then(() => {
				this.context.actions.setActiveRepoDetails(repoId);
				this.context.actions.listRepoEvents(repoId);
			});			
		} else {
			this.context.actions.setActiveRepoDetails(repoId).then(() => {
				this.context.actions.listRepoEvents(repoId);	
			});
		}
	}
	componentWillUnmount() {
		this.context.actions.resetRepoDetailsState();
	}
	toRepoList(){
		this.context.router.push('/repositories');
	}
	renderRepoSettings(activeRepo){
		if(this.context.state.repoDetails.showSettings) {
			return (
				<RepoSettings 
					activeRepo={activeRepo}
				/>
			);
		}
	}
	renderDeleteRepo(){

		if(this.context.state.repoDetails.deleteXHR) {
			return (
				<Loader />
			);
		}

		if(this.context.state.repoDetails.isDeleting) {
			return (
				<CenteredConfirm message="Are you sure you want to delete this repository? All data will be lost."
							     confirmButtonText="Delete"
							     confirmButtonStyle={{}}
							     onConfirm={() => this.context.actions.deleteActiveRepo(this.toRepoList.bind(this))}
							     onCancel={() => this.context.actions.toggleActiveRepoDelete()}/>
			);
		}
	}
	renderEventTimeline(){
		let events = this.context.state.repoDetails.events;

		return (
			<RepoEventTimeline 
				events={events}
			/>
		);
	}
	renderPageLoader(){
		return (
			<div className="PageLoader">
				<Loader />
			</div>
		);
	}
	renderHeader(activeRepo){
		return (
			<div className="SmallHeader FlexRow SpaceBetween">
				<div className="FlexColumn Flex1">
					<h3>{activeRepo.name}</h3>
					<span>{RegistryNames[activeRepo.provider]}</span>
				</div>
				<div>
					{this.renderActions()}
				</div>
			</div>
		);
	}
	renderActions(){
		let buttons = [
			{
				icon: 'icon icon-dis-terminate',
			    onClick: () => this.context.actions.toggleActiveRepoDelete(),
				isActive: false,
				toolTip: 'Disconnect'
			},
			{
				icon: 'icon icon-dis-settings',
			    onClick: () => this.context.actions.toggleActiveRepoSettings(),
				isActive: false,
				toolTip: 'Settings'
			}
		];

		return (
			<BtnGroup buttons={buttons} />
		);
	}
	render() {	
		if(this.context.state.repoDetails.pageXHR || this.context.state.repoDetails.eventsXHR) {
			return this.renderPageLoader()
		}

		let activeRepo = this.context.state.repoDetails.activeRepo;

		return (
			<div className="ContentContainer">
				{this.renderHeader(activeRepo)}
				<div>
				 	{this.renderDeleteRepo()}
				    {this.renderRepoSettings(activeRepo)}
				    {this.renderEventTimeline()}
				</div>
			</div>
		);
	}
}

RepoDetailsPage.childContextTypes = {
	actions: React.PropTypes.object,
    state: React.PropTypes.object,
    router: React.PropTypes.object
};

RepoDetailsPage.contextTypes = {
	actions: React.PropTypes.object,
    state: React.PropTypes.object,
    router: React.PropTypes.object
};