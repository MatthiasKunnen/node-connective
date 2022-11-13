import {ExclusiveUnion} from '../../../utils/types';
import {
    CreateCheckboxFieldInput,
    CreateRadioGroupInput,
    CreateSigningFieldInput,
    CreateTextBoxFieldInput,
} from '../../documents/elements/element.interface';

export interface CreateActor {

    /**
     * This parameter determines whether notifications are sent to the actor, informing them about
     * the package. By default, its value is false, which means notifications are sent.
     * @default false
     */
    SuppressNotifications?: boolean | null;
}

export interface ActorWithBackButton {

    /**
     * URL to which the end user is sent after pressing back button. This parameter does not apply
     * to receivers.
     */
    BackButtonUrl?: string | null;
}

export interface ActorWithRedirectUrl {

    /**
     * Url to which the stakeholder is redirected after completing this action.
     */
    RedirectUrl?: string | null;
}

export interface ActorWithRedirectType extends ActorWithRedirectUrl {

    /**
     * If a RedirectUrl has been defined then this parameter defines when exactly signer actors are
     * redirected when using an asynchronous signing method or when a fom filler actor is redirected
     * after filling out forms. Important: The RedirectType parameter must only be used for actors
     * of the type FormFiller or Signer. It is not allowed for the types Approver or Receiver.
     * The RedirectType parameter is forbidden if no RedirectUrl has been set.
     * Possible values: AfterSession (default), AfterCompletion, AfterDelay, Immediately. By
     * default, actors are redirected AfterSession. This means they cannot close the form
     * filling/signing session and have to wait for all fields to be filled or all documents to be
     * signed before being redirected. For actors to be redirected immediately, enter Immediately as
     * value. For actors to be redirected after 5 seconds, enter AfterDelay as value. To make sure
     * the final actor is only redirected after the entire package is completed, enter
     * AfterCompletion as value. Note: when AfterCompletion is set for multiple actors, it will only
     * be applied to the final actor. For the other actors, the default AfterSession will be used.
     */
    RedirectType?: 'AfterSession' | 'AfterCompletion' | 'AfterDelay' | 'Immediately' | null;
}

interface ActorElementWithDocumentId {
    /**
     * The ID of the document to add this actor to.
     */
    DocumentId: string;
}

export interface CreateFormFillerActorInput extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectType {
    Type: 'formFiller';
    Elements: Array<ExclusiveUnion<
        | CreateCheckboxFieldInput
        | CreateRadioGroupInput
        | CreateTextBoxFieldInput
    > & ActorElementWithDocumentId>;
}

export interface CreateApproverActorInput extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectUrl {
    Type: 'approver';
}

export interface CreateSignerActorInput extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectType {
    Type: 'signer';
    Elements: Array<CreateSigningFieldInput & ActorElementWithDocumentId>;
}

export interface CreateReceiverActorInput extends CreateActor {
    Type: 'receiver';
}

export type CreateActorParamsInput =
    | CreateFormFillerActorInput
    | CreateApproverActorInput
    | CreateSignerActorInput
    | CreateReceiverActorInput
;

export interface CreateActorInput {
    PackageId: string;

    StakeholderId: string;

    Actor: CreateActorParamsInput;
}

export interface CreateActorResponseBase extends CreateActor {

    /**
     * Unique identifier of the actor.
     */
    Id: string;

    Status:
        | 'Draft'
        | 'Waiting'
        | 'Available'
        | 'InProgress'
        | 'Failed'
        | 'Finished'
        | 'Rejected'
        | 'Skipped';

    /**
     * Links to interact with the package for this person stakeholder.
     */
    Links: Array<string>;

    /**
     * @todo documentation unclear
     */
    MemberLinks: Array<any>;

    ActionUrls: Array<any>;
}

export interface ActorWithResult {

    /**
     * Result of a completed action.
     */
    Result?: ActorResult | null;
}

export interface CreateApproverActorResponse extends CreateActorResponseBase,
    CreateApproverActorInput,
    ActorWithResult {
}

export interface CreateFormFillerActorResponse extends CreateActorResponseBase,
    CreateFormFillerActorInput,
    ActorWithResult {
}

export interface CreateReceiverActorResponse extends CreateActorResponseBase,
    CreateReceiverActorInput {
}

export interface CreateSignerActorResponse extends CreateActorResponseBase,
    CreateSignerActorInput,
    ActorWithResult {
}

export type CreateActorResponse =
    | CreateApproverActorResponse
    | CreateFormFillerActorResponse
    | CreateReceiverActorResponse
    | CreateSignerActorResponse
;

export interface ActorResult {

    /**
     * Email address.
     */
    CompletedBy: string;

    /**
     * The actor's verified name as mentioned on the signing certificate or signing service. This
     * parameter only applies to signers.
     */
    VerifiedName?: string | null;

    /**
     * Date when the action was completed.
     */
    CompletedDate: string;

    /**
     * Signing method the actor used to sign the document. This parameter only applies to signers.
     */
    SigningMethod: string;

    /**
     * Reason why a document was rejected.
     */
    RejectReason?: string | null;
}

export interface GetStakeholderActorsInput {
    /**
     * Unique identifier of the package to which the actor belongs.
     */
    packageId: string;

    /**
     * Unique identifier of the stakeholder to which the actor belongs.
     */
    stakeholderId: string;
}

export interface GetStakeholderActorByIdInput {
    /**
     * Unique identifier of the package to which the actor belongs.
     */
    packageId: string;

    /**
     * Unique identifier of the stakeholder to which the actor belongs.
     */
    stakeholderId: string;

    /**
     * Unique identifier of the actor you want to retrieve.
     */
    actorId: string;
}

export type DeleteActorByIdResponse = '';
