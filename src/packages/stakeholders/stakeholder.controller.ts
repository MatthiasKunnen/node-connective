import {AxiosInstance, AxiosPromise, AxiosResponse} from 'axios';

import {ElementWithDocumentId} from '../documents/elements/element.interface';
import {ActorController} from './actors/actor.controller';
import {
    CreateStakeholderContactGroupInput,
    CreateStakeholderGroupInput,
    CreateStakeholderInput,
    CreateStakeholderInputParams,
    CreateStakeholderPersonInput,
    GetStakeholderByIdInput,
    Stakeholder,
    StakeholderContactGroup,
    StakeholderGroup,
    StakeholderPerson,
} from './stakeholder.interface';

export class StakeholderController {

    readonly actors: ActorController;

    constructor(
        private readonly http: AxiosInstance,
    ) {
        this.actors = new ActorController(this.http);
    }

    /**
     * Get all stakeholders of a package.
     */
    async all(
        packageId: string,
    ): Promise<AxiosResponse<Array<Stakeholder>>> {
        return this.http.get(`/packages/${packageId}/stakeholders`);
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
        input: CreateStakeholderInput<
            CreateStakeholderContactGroupInput<ElementWithDocumentId>
        >,
    ): Promise<AxiosResponse<StakeholderContactGroup>>;
    async create(
        input: CreateStakeholderInput<CreateStakeholderGroupInput<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<StakeholderGroup>>;
    async create(
        input: CreateStakeholderInput<CreateStakeholderPersonInput<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<StakeholderPerson>>;
    async create(
        input: CreateStakeholderInput<CreateStakeholderInputParams<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<Stakeholder>> {
        return this.http.post(`/packages/${input.PackageId}/stakeholders`, input.Stakeholder);
    }

    async getById(input: GetStakeholderByIdInput): Promise<AxiosPromise<Stakeholder>> {
        return this.http.get(`/packages/${input.PackageId}/stakeholders/${input.StakeholderId}`);
    }
}
