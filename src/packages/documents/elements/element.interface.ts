import {ExternalReference} from '../../../interfaces/common.interface';
import {
    LegalNotice,
    OverwriteLegalNotice,
} from '../../../interfaces/legal-notice.interface';
import {ExclusiveUnion} from '../../../utils/types';

export interface ElementLocation {

    /**
     * The page of the document on which the element is placed. The paging works as follows: '1' is
     * the first page of the PDF, '2' the second, and so on. '0' must not be used as page value. To
     * count backwards from the last page, use negative integers: '-1' for the last page, '-2' for
     * the second to last, and so on.
     */
    Page: number;

    /**
     * How far from the top edge of the document the element is placed in points
     * (1 point = 1/72 inch).
     */
    Top: number;

    /**
     * How far from the left edge of the document the element is placed in points
     * (1 point = 1/72 inch).
     */
    Left: number;
}

export interface ElementDimensions {

    /**
     * Width of the element in points (1 point = 1/72 inch).
     */
    Width: number;

    /**
     * Height of the element in points (1 point = 1/72 inch).
     */
    Height: number;
}

export interface AddElementInput<T extends CreateElementInputBase> {

    /**
     * ID of the package to add the element to.
     */
    PackageId: string;

    /**
     * ID of the document to add the element to.
     */
    DocumentId: string;

    /**
     * Element info.
     */
    Element: T;
}

export type CreateElementInputBase = ExternalReference;

interface CreateElementOutputBase {

    /**
     * Element ID
     */
    Id: string;

    /**
     * Actor to which the element is linked.
     */
    ActorId: string;

    /**
     * Date and time on which this element was completed.
     */
    CompletedDate: string | null;

    /**
     * The status of the document element. Possible values: Pending, InProgress, Rejected, Failed,
     * Finished, Refused.
     */
    Status: 'Pending' | 'InProgress' | 'Rejected' | 'Failed' | 'Finished' | 'Refused';
}

export interface CreateElementWithFieldIdentifier {
    /**
     * The name of an input field on the document. Note that the FieldId must be unique per
     * document.
     */
    FieldId: string;
}

export interface CreateElementWithLocation {

    Location: ElementLocation;

    Dimensions: ElementDimensions;
}

export interface CreateElementWithMarker {

    /**
     * A marker is a piece of text inside the document where an element must be. It contains the
     * location and dimensions of the element. Pattern: #[a-zA-Z]+(?:\d*.)?\d+.
     */
    Marker: string;
}

export interface CreateElementWithValue {

    /**
     * The label or alternative name of the form field.
     */
    Label?: string | null;

    /**
     * The value that will be shown as tooltip when a user hovers over the form field with the
     * cursor. Note: If you're sending a document that already contains a prefilled form field with
     * a tooltip, and enter a ToolTipLabel parameter, the value of this parameter will overwrite the
     * original value. To avoid overwriting the original value, the ToolTipLabel parameter must be
     * null.
     */
    ToolTipLabel?: string | null;
}

export interface ElementWithName {

    /**
     * Name of the form field. Note that the name must be unique per document.
     */
    Name?: string | null;
}

interface CreateCheckBoxFieldBase extends CreateElementInputBase, CreateElementWithValue {
    Type: 'checkboxfield';

    /**
     * Determines whether the checkbox is mandatory or optional. When set to true, the checkbox is
     * mandatory. The default value is false. Note: If you're sending documents that already contain
     * a prefilled form field, make sure the IsRequired parameter is null. Otherwise, the original
     * value will be overwritten.
     * @default false
     */
    IsRequired?: boolean | null;

    /**
     * Determines whether the checkbox is checked or unchecked by default. When set to true, the
     * checkbox is checked. The default value is false. Note: If you're sending documents that
     * already contain a prefilled form field, make sure the DefaultValue parameter is set to false.
     * Otherwise, the original value will be overwritten.
     */
    DefaultValue?: boolean | null;
}

export type CreateCheckboxFieldInput = CreateCheckBoxFieldBase & ExclusiveUnion<
    | CreateElementWithMarker
    | CreateElementWithFieldIdentifier
    | CreateElementWithLocation & ElementWithName
>;

export type CreateCheckboxFieldOutput =
    & CreateElementOutputBase
    & CreateCheckBoxFieldBase
    & CreateElementWithLocation
    & ElementWithName
    & {

    /**
     * The value of the completed checkbox field.
     */
    Checked: boolean | null;
};

interface CreateRadioGroupBase extends CreateElementInputBase, CreateElementWithValue {

    Type: 'radiogroup';

    /**
     * Name of the form field. Note that the name must be unique per document. Important: The Name
     * parameter must not be used when specifying an existing RadioGroup (created in Adobe Pro DC
     * for instance) by means of the FieldId parameter.
     */
    Name?: string | null;

    /**
     * Determines whether the RadioGroup is mandatory or optional. When set to true, the RadioGroup
     * is mandatory. The default value is false. Note: If you're sending documents that already
     * contain a prefilled form field, make sure the IsRequired parameter is null. Otherwise, the
     * original value will be overwritten.
     * @default false
     */
    IsRequired?: boolean | null;
}

interface CreateRadioGroupWithOptions {

    /**
     * To be used if the RadioGroup does not already exist. If it does, use the FieldId parameter.
     */
    Options?: Array<CreateRadioGroupOption> | null;
}

export interface CreateRadioGroupOption extends CreateElementWithLocation {
    Name: string;
    ToolTipLabel?: string | null;
    Label?: string;
    IsSelected: boolean;
}

export type CreateRadioGroupInput = CreateRadioGroupBase & ExclusiveUnion<
    | CreateElementWithFieldIdentifier
    | CreateRadioGroupWithOptions
>;

export type CreateRadioGroupOutput =
    & CreateElementOutputBase
    & CreateRadioGroupBase
    & CreateRadioGroupWithOptions
    & {

    /**
     * The name of the selected RadioOption.
     */
    Selected: string | null;
};

export interface CreateSigningFieldBase extends CreateElementInputBase {

    Type: 'signingfield';

    /**
     * The SigningMethods that may be used to sign this signing field. Note: When using a single
     * SigningMethod, it must also be placed in an array.
     */
    SigningMethods?: Array<string> | null;

    /**
     * Legal notice that will be added to the signing field.
     */
    LegalNotice?: LegalNotice | null;
}

export type CreateSigningFieldInput = CreateSigningFieldBase & ExclusiveUnion<
    | CreateElementWithLocation
    | CreateElementWithMarker
    | CreateElementWithFieldIdentifier
>;

export type CreateSigningFieldOutput =
    & CreateElementOutputBase
    & OverwriteLegalNotice<CreateSigningFieldBase>
    & CreateElementWithLocation
    & {

    /**
     * SigningMethod that was used to sign this SigningField.
     */
    UsedSigningMethod: string | null;
};

interface CreateTextBoxFieldBase extends CreateElementInputBase, CreateElementWithValue {

    Type: 'textboxfield';

    /**
     * Determines whether the TextFieldBox is mandatory or optional. When set to true, the text
     * field is mandatory. The default value is false. Note: If you're sending a document that
     * already contains a prefilled form field, make sure the IsRequired parameter is null.
     * Otherwise, the original value will be overwritten.
     * @default false
     */
    IsRequired?: boolean | null;

    /**
     * Default value prefilled in the TextBoxField. Note: If you're sending a document that already
     * contains a prefilled form field and enter a DefaultValue parameter, the value of this
     * parameter will overwrite the original value. To avoid overwriting the original value, the
     * DefaultValue parameter must be null.
     */
    DefaultValue?: string | null;
}

interface CreateNewTextBoxField {

    /**
     * Name of the form field. Note that the name must be unique per document.
     * Overridden with marker name if a marker is used.
     */
    Name: string;

    /**
     * Determines whether the TextBoxField has multiple lines. Default value is false. When set to
     * true, the TextBoxField will be scrollable.
     * @default false
     */
    IsMultiline?: boolean | null;

    /**
     * Determines the maximum number of characters that may be entered in the TextBoxField.
     */
    CharLimit?: number | null;
}

export type CreateTextBoxFieldInput = CreateTextBoxFieldBase & ExclusiveUnion<
    | CreateNewTextBoxField & CreateElementWithLocation
    | CreateNewTextBoxField & CreateElementWithMarker
    | CreateElementWithFieldIdentifier
>;

export type CreateTextBoxFieldOutput =
    & CreateElementOutputBase
    & CreateTextBoxFieldBase
    & CreateNewTextBoxField
    & CreateElementWithLocation
    & ElementWithName
    & {
    /**
     * Value of the completed TextBoxField.
     */
    Value: string | null;
};

export type CreateElementInput =
    | CreateCheckboxFieldInput
    | CreateRadioGroupInput
    | CreateSigningFieldInput
    | CreateTextBoxFieldInput
;

export type CreateElementOutput =
    | CreateCheckboxFieldOutput
    | CreateRadioGroupOutput
    | CreateSigningFieldOutput
    | CreateTextBoxFieldOutput
;

export interface GetElementByIdInput {
    packageId: string;
    documentId: string;
    elementId: string;
}

export interface DeleteElementByIdInput {
    packageId: string;
    documentId: string;
    elementId: string;
}

export type DeleteElementByIdOutput = '';

/**
 * Used to add an element to an existing document. The document MUST exist.
 */
export interface ElementWithDocumentId {

    /**
     * The ID of the document to add this actor to.
     */
    DocumentId: string;
}

/**
 * Used to add an element to a document that will be created in the same call.
 * E.g. package creation.
 */
export interface ElementWithDocumentIndex {

    /**
     * The index of the document to add the element to. 0 for the first document, 1 for the
     * second, ...
     */
    DocumentIndex: number;
}
