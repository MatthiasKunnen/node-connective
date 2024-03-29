import {ExclusiveUnion, Noop, PickRequired} from '../../utils/types';
import {
    Actor,
    CreateActorParamsInput,
} from './actors/actor.interface';

export interface WithSubstitutes {
    Substitutes: Array<unknown>;
}

export interface StakeholderBase {
    /**
     * Unique identifier of the stakeholder.
     */
    Id: string;

    /**
     * Unique identifier of the package to which the stakeholder is added.
     */
    PackageId: string;

    /**
     * Actors that are added to the stakeholder.
     */
    Actors: Array<Actor>;
}

export interface CreateStakeholderBase<ElementDocumentId> {

    Actors?: Array<CreateActorParamsInput<ElementDocumentId>> | null;

    /**
     * External reference to this resource given by a calling application. This parameter is not
     * used by eSignatures itself. Maximum length: 256
     */
    ExternalReference?: string | null;
}

export interface CreateStakeholderPersonInput<ElementDocumentId>
    extends CreateStakeholderBase<ElementDocumentId> {

    Type: 'person';

    /**
     * UI language of this stakeholder, expressed in a 2-letter ISO 639-1 code.
     */
    Language: string;

    /**
     * First name of the stakeholder Maximum length: 150
     */
    FirstName: string;

    /**
     * Last name of the stakeholder Maximum length: 150
     */
    LastName: string;

    EmailAddress: string;

    /**
     * Phone number to receive an SMS OTP.
     */
    PhoneNumber?: string | null;

    /**
     * Date of birth in format: YYYY-MM-DD
     */
    BirthDate?: string | null;

    /**
     * Additional properties may contain any additional stakeholder information the administrator
     * deemed necessary. For instance, the stakeholder's maiden name, their nationality, etc. By
     * default, two additional properties are configured in every environment: BeID and BeLawyer. In
     * the BeID property you can pass the stakeholder's national security number and in the BeLawyer
     * property you can pass their lawyerID. As of eSignatures 6.2.1, mandated signing rules can be
     * configured in the Config Index and applied to any additional property. When a mandated
     * signing rule has been applied, the additional property to which it is applied becomes
     * mandatory. Their value will be checked against the external data extracted from the signing
     * certificate or returned by the signing service. If the data matches, the stakeholder will be
     * mandated to sign. Tip: To know which additional properties are mandatory for which
     * SigningMethod, do a Get SigningMethods call. To know which additional properties are
     * supported but not mandatory, you need to check the Config Index or contact your
     * administrator.
     * E.g. `{"BeId": "12345678900"}` or `{"Nationality": "Belgian"}`.
     */
    AdditionalProperties?: Record<string, string> | null;
}

export type CreateMember = Omit<
    CreateStakeholderPersonInput<Noop>,
    'Actors' | 'Type'
>;
export type Member = PickRequired<
    CreateMember,
    'AdditionalProperties'
> & WithSubstitutes;

export interface StakeholderPerson extends StakeholderBase,
    WithSubstitutes,
    Omit<CreateStakeholderPersonInput<Noop>, 'Actors'> {
}

export interface CreateStakeholderGroupInput<ElementDocumentId>
    extends CreateStakeholderBase<ElementDocumentId> {

    Type: 'group';

    /**
     * Name of the group.
     */
    GroupName: string;

    /**
     * Members that are part of the group.
     */
    Members: Array<CreateMember>;
}

export interface StakeholderGroup extends StakeholderBase,
    Omit<CreateStakeholderGroupInput<Noop>, 'Actors'> {
    Members: Array<Member>;
}

export interface CreateStakeholderContactGroupInput<ElementDocumentId>
    extends CreateStakeholderBase<ElementDocumentId> {

    Type: 'contactgroup';

    /**
     * An eSignatures contactGroup identifier.
     */
    ContactGroupCode: string;
}

export interface StakeholderContactGroup extends StakeholderBase,
    Omit<CreateStakeholderContactGroupInput<Noop>, 'Actors'> {
    Members: Array<Member>;
}

export type CreateStakeholderInputParams<ElementDocumentId> =
    | CreateStakeholderPersonInput<ElementDocumentId>
    | CreateStakeholderGroupInput<ElementDocumentId>
    | CreateStakeholderContactGroupInput<ElementDocumentId>;

export interface CreateStakeholderInput<T> {
    PackageId: string;

    Stakeholder: T;
}

/**
 * Undocumented Stakeholder that will be created when adding an element to an existing document.
 */
export interface UndecidedStakeholder extends StakeholderBase {
    Type: 'undecided';
}

export type Stakeholder = ExclusiveUnion<
    | StakeholderPerson
    | StakeholderGroup
    | StakeholderContactGroup
    | UndecidedStakeholder
>;

export interface GetStakeholderByIdInput {
    PackageId: string;

    StakeholderId: string;
}
