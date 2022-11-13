import {AxiosInstance, AxiosResponse} from 'axios';

import {ElementWithDocumentId} from '../../documents/elements/element.interface';
import {
    Actor,
    ApproverActor,
    CreateActorInput,
    CreateActorParamsInput,
    CreateApproverActorInput,
    CreateFormFillerActorInput,
    CreateReceiverActorInput,
    CreateSignerActorInput,
    DeleteActorByIdResponse,
    FormFillerActor,
    GetStakeholderActorByIdInput,
    GetStakeholderActorsInput,
    ReceiverActor,
    SignerActor,
} from './actor.interface';

/**
 * An actor is a single action a stakeholder needs to take on a package.
 * There are four types of actors: form fillers, approvers, signers and receivers.
 */
export class ActorController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
    }

    /**
     * Gets a stakeholder's actors.
     */
    async all(
        input: GetStakeholderActorsInput,
    ): Promise<AxiosResponse<Array<Actor>>> {
        return this.http.get(
            `/packages/${input.PackageId}/stakeholders/${input.StakeholderId}/actors`,
        );
    }

    /**
     * Creates an actor and adds it to the stakeholder you specify. An actor is a single action that
     * a stakeholder must perform on a package.
     *
     * The different actor types are:
     *
     * - FormFiller (as of eSignatures 6.3)
     *   A FormFiller must fill in TextBoxFields, CheckBoxFields and/or RadioGroups on a document.
     *   FormFiller actors do not sign or approve documents.
     * - Approver
     *   An Approver must approve the document before it is sent to any signer. Note that the
     *   approval may occur before or after the filling of forms.
     * - Signer
     *   A Signer must sign the document.
     * - Receiver
     *   A Receiver receives a copy of the document when it has been signed by all signers. A
     *   Receiver does not take action on the document.
     *
     * Important:
     * All FormFillers/Approvers must be added to the first step of the process. This is because
     * they must first take action on a package before it is sent to any signers. All receivers must
     * be added to the last step of the process, since a package is only sent to receivers once it
     * has been signed by all signers. If you do not define the process steps manually, all
     * FormFiller actors are also added to the first step, together with the Approvers.
     * As a result, the approval action may happen before, during or after the filling of forms.
     *
     * Attention: All other process steps may only contain one type of actor. It's not supported to
     * mix actor types, with the exception of FormFillers and Approvers, within an array.
     */
    async create(
        input: CreateActorInput<CreateApproverActorInput>,
    ): Promise<AxiosResponse<ApproverActor>>;
    async create(
        input: CreateActorInput<CreateFormFillerActorInput<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<FormFillerActor>>;
    async create(
        input: CreateActorInput<CreateReceiverActorInput>,
    ): Promise<AxiosResponse<ReceiverActor>>;
    async create(
        input: CreateActorInput<CreateSignerActorInput<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<SignerActor>>;
    async create(
        input: CreateActorInput<CreateActorParamsInput<ElementWithDocumentId>>,
    ): Promise<AxiosResponse<Actor>> {
        return this.http.post(
            `/packages/${input.PackageId}/stakeholders/${input.StakeholderId}/actors`,
            input.Actor,
        );
    }

    /**
     * This call allows you to delete a specified actor from a draft package.
     */
    async deleteById(
        {
            ActorId,
            StakeholderId,
            PackageId,
        }: GetStakeholderActorByIdInput,
    ): Promise<AxiosResponse<DeleteActorByIdResponse>> {
        return this.http.delete(
            `/packages/${PackageId}/stakeholders/${StakeholderId}/actors/${ActorId}`,
        );
    }

    /**
     * Get Actor by ID.
     */
    async getById(
        {
            ActorId,
            StakeholderId,
            PackageId,
        }: GetStakeholderActorByIdInput,
    ): Promise<AxiosResponse<Actor>> {
        return this.http.get(
            `/packages/${PackageId}/stakeholders/${StakeholderId}/actors/${ActorId}`,
        );
    }
}
