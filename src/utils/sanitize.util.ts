const cannotEndIn = /[. ]+$/;
const noReservedWindowsFilename = /^(aux|com[0-9]|con|lpt[0-9]|nul|prn)(\..*)?$/i;
const notJustDots = /^\.+$/;

/**
 * To be used for Package and Document names.
 *
 * Removes characters that are not allowed in filenames, and are not represent in ISO 8859-15 since
 * Itsme does not allow any characters outside it. Also removes illegal Windows filenames and limits
 * the amount of characters to 150.
 */
export function sanitizeConnectiveName(name: string): string {
    const replacement = '';

    // ISO 8859-15 characters: https://www.unicode.org/Public/MAPPINGS/ISO8859/8859-15.TXT
    // Filename limitations:
    // https://en.wikipedia.org/wiki/Filename#Comparison_of_filename_limitations

    name = name.replace(
        // eslint-disable-next-line max-len, no-irregular-whitespace
        /[^ !"#$%&'()+,\-.0123456789;=@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{}~ ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/g,
        replacement,
    );

    return name
        .replace(cannotEndIn, replacement)
        .replace(noReservedWindowsFilename, replacement)
        .replace(notJustDots, replacement)
        .substring(0, 150);
}
