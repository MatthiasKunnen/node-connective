import {AxiosInstance, AxiosResponse} from 'axios';

import {ActorsController} from './actors/actors.controller';
import {
    CreateStakeholderContactGroupInput,
    CreateStakeholderContactGroupResponse,
    CreateStakeholderGroupInput,
    CreateStakeholderGroupResponse,
    CreateStakeholderInput,
    CreateStakeholderPersonInput,
    CreateStakeholderPersonResponse,
    CreateStakeholderResponse,
} from './stakeholder.interface';

export class StakeholdersController {

    readonly actors: ActorsController;

    constructor(
        private readonly http: AxiosInstance,
    ) {
        this.actors = new ActorsController(this.http);
    }

    /**
     * Add a stakeholder to the specified package.
     *
     * The type of stakeholder created depends on the `Params.Type` parameter.
     *
     * A person stakeholder is a single person. Only that person will be able to take action on the
     * package.
     *
     * A group stakeholder is a group of people who can interact with the package. The members of
     * the group must be specified within the POST stakeholder call. When a group of people is
     * defined, any member of the group will be able to form fill, approve or sign on behalf of the
     * entire group. Each person of the group will receive a unique URL to form fill/approve/sign
     * their document.
     * Attention: as soon as one member of the group has taken action, the others no longer can.
     *
     * A contactGroup stakeholder can be used when a contact group has been created in the
     * eSignatures WebPortal. This type functions in the same way as a group stakeholder. The only
     * difference is that you simply pass the contactGroup code obtained in the WebPortal instead of
     * defining each member in the call.
     * Note: the stakeholder type contactGroup only exists when the package is in draft status. When
     * the status changes to pending, the stakeholder type contactGroup is converted to group.
     * The contactGroupCode value remains.
     */
    async create(
        packageId: string,
        input: CreateStakeholderContactGroupInput,
    ): Promise<AxiosResponse<CreateStakeholderContactGroupResponse>>;
    async create(
        packageId: string,
        input: CreateStakeholderGroupInput,
    ): Promise<AxiosResponse<CreateStakeholderGroupResponse>>;
    async create(
        packageId: string,
        input: CreateStakeholderPersonInput,
    ): Promise<AxiosResponse<CreateStakeholderPersonResponse>>;
    async create(
        packageId: string,
        input: CreateStakeholderInput,
    ): Promise<AxiosResponse<CreateStakeholderResponse>> {
        return this.http.post(`/packages/${packageId}/stakeholders`, input);
    }

    async get(packageId: string) {
        // @todo type properly and extend stakeholder functions Stakeholder.type can be undecided!
        return this.http.get(`/packages/${packageId}/stakeholders`)
    }
}
