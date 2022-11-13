import {ExclusiveUnion, Noop, RequireWithDiscriminator} from '../../../utils/types';
import {
    CreateCheckboxFieldInput,
    CreateCheckboxFieldOutput,
    CreateRadioGroupInput,
    CreateRadioGroupOutput,
    CreateSigningFieldInput,
    CreateSigningFieldOutput,
    CreateTextBoxFieldInput,
    CreateTextBoxFieldOutput,
} from '../../documents/elements/element.interface';

export interface CreateActor {

    /**
     * This parameter determines whether emails/notifications are sent to the actor, informing them
     * about the package. By default, its value is false, which means notifications are sent.
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

export interface CreateFormFillerActorInput<ElementDocumentId> extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectType {
    Type: 'formFiller';
    Elements: Array<ExclusiveUnion<
        | CreateCheckboxFieldInput
        | CreateRadioGroupInput
        | CreateTextBoxFieldInput
    > & ElementDocumentId>;
}

export interface CreateApproverActorInput extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectUrl {
    Type: 'approver';
}

export interface CreateSignerActorInput<ElementDocumentId> extends CreateActor,
    ActorWithBackButton,
    ActorWithRedirectType {
    Type: 'signer';
    Elements: Array<CreateSigningFieldInput & ElementDocumentId>;
}

export interface CreateReceiverActorInput extends CreateActor {
    Type: 'receiver';
}

export type CreateActorParamsInput<ElementDocumentId> =
    | CreateApproverActorInput
    | CreateFormFillerActorInput<ElementDocumentId>
    | CreateReceiverActorInput
    | CreateSignerActorInput<ElementDocumentId>
;

export interface CreateActorInput<T> {
    PackageId: string;

    StakeholderId: string;

    Actor: T;
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
     * Links for each group stakeholder that can be used to interact with the package.
     */
    MemberLinks: Array<MemberLink>;

    /**
     * Action URLs allow people to perform an action such as signing or viewing an action. The
     * action they can perform depends on the {@link ActionUrl.Type Action URL Type}.
     */
    ActionUrls: Array<ActionUrl>;
}

export interface ActionUrl {

    /**
     * The email address of the person.
     */
    Email: string;

    /**
     * The url the person can use to interact with the package.
     */
    Url: string;

    /**
     * The type of action that can be performed with the {@link ActionUrl.Url Url}. `Preview`
     * allows the person to view the package but not interact with it, `Signer` allows the person to
     * sign the package, `Download` allows for downloading the package.
     */
    Type: 'Download' | 'Preview' | 'Signer';
}

export interface MemberLink {
    /**
     * The email address of the member.
     */
    Email: string;

    /**
     * The link the member can use to interact with the package.
     */
    Link: string;
}

export interface ActorWithResult {

    /**
     * Result of a completed action.
     */
    Result?: ActorResult | null;
}

export type ApproverActor = RequireWithDiscriminator<
    & CreateActorResponseBase
    & CreateApproverActorInput
    & ActorWithResult,
    'Status',
    'Finished' | 'Rejected',
    'Result'>;

export type FormFillerActor = RequireWithDiscriminator<
    & CreateActorResponseBase
    & Omit<CreateFormFillerActorInput<Noop>, 'Elements'>
    & ActorWithResult
    & {
        Elements: Array<ExclusiveUnion<
            | CreateCheckboxFieldOutput
            | CreateRadioGroupOutput
            | CreateTextBoxFieldOutput
        >>;
    },
    'Status',
    'Finished' | 'Rejected',
    'Result'>;

export type ReceiverActor =
    & CreateActorResponseBase
    & CreateReceiverActorInput
;

export type SignerActor = RequireWithDiscriminator<
    & CreateActorResponseBase
    & Omit<CreateSignerActorInput<Noop>, 'Elements'>
    & ActorWithResult
    & {
        Elements: Array<CreateSigningFieldOutput>;
    },
    'Status',
    'Finished' | 'Rejected',
    'Result'>;

export type Actor =
    | ApproverActor
    | FormFillerActor
    | ReceiverActor
    | SignerActor
;

export interface ActorResult {

    CompletedBy: ActorCompletedBy | null;

    /**
     * Date when the action was completed.
     */
    CompletedDate: string;

    /**
     * Signing method the actor used to sign the document. This parameter only applies to signers.
     */
    SigningMethod?: string | null;

    /**
     * Reason why a document was rejected.
     */
    RejectReason?: string | null;
}

export interface ActorCompletedBy {

    /**
     * Email address of the actor.
     */
    Email: string;

    /**
     * The actor's verified name as mentioned on the signing certificate or signing service. This
     * parameter only applies to signers.
     */
    VerifiedName?: string | null;
}

export interface GetStakeholderActorsInput {
    /**
     * Unique identifier of the package to which the actor belongs.
     */
    PackageId: string;

    /**
     * Unique identifier of the stakeholder to which the actor belongs.
     */
    StakeholderId: string;
}

export interface GetStakeholderActorByIdInput {
    /**
     * Unique identifier of the package to which the actor belongs.
     */
    PackageId: string;

    /**
     * Unique identifier of the stakeholder to which the actor belongs.
     */
    StakeholderId: string;

    /**
     * Unique identifier of the actor you want to retrieve.
     */
    ActorId: string;
}

export type DeleteActorByIdResponse = '';
