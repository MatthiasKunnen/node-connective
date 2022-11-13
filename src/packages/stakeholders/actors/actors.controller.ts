import {AxiosInstance, AxiosResponse} from 'axios';

import {
    CreateActorInput,
    CreateActorResponse, DeleteActorByIdResponse,
    GetStakeholderActorByIdInput,
    GetStakeholderActorsInput,
} from './actors.interface';

/**
 * An actor is a single action a stakeholder needs to take on a package.
 * There are four types of actors: form fillers, approvers, signers and receivers.
 */
export class ActorsController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
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
    async create(input: CreateActorInput) {
        return this.http.post(
            `/packages/${input.PackageId}/stakeholders/${input.StakeholderId}/actors`,
            input.Actor,
        );
    }

    /**
     * Gets a stakeholder's actors.
     */
    async all(
        {
            packageId,
            stakeholderId,
        }: GetStakeholderActorsInput,
    ): Promise<AxiosResponse<Array<CreateActorResponse>>> {
        return this.http.get(`/packages/${packageId}/stakeholders/${stakeholderId}/actors`);
    }

    /**
     * Get Actor by ID.
     */
    async getById(
        {
            actorId,
            stakeholderId,
            packageId,
        }: GetStakeholderActorByIdInput,
    ): Promise<AxiosResponse<CreateActorResponse>> {
        return this.http.get(
            `/packages/${packageId}/stakeholders/${stakeholderId}/actors/${actorId}`,
        );
    }

    /**
     * This call allows you to delete a specified actor from a draft package.
     */
    async deleteById(
        {
            actorId,
            stakeholderId,
            packageId,
        }: GetStakeholderActorByIdInput,
    ): Promise<AxiosResponse<DeleteActorByIdResponse>> {
        return this.http.delete(
            `/packages/${packageId}/stakeholders/${stakeholderId}/actors/${actorId}`,
        );
    }
}
