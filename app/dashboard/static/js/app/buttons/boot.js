/*! Kernel CI Dashboard | Licensed under the GNU GPL v3 (or later) */
define([
    'jquery',
    'utils/html',
    'sprintf'
], function($, html) {
    'use strict';
    var gBootButtons,
        gStrings;

    gBootButtons = {};

    gStrings = {
        show_class: 'fa fa-eye',
        hide_class: 'fa fa-eye-slash',
        lab_show_tooltip: 'Show content of lab &#171;%s&#187;',
        lab_hide_tooltip: 'Hide content of lab &#171;%s&#187;',
        lab_hidden: 'Content of lab &#171;%s&#187; hidden. ' +
            'Use the <i class="fa fa-eye"></i> button to show it again.'
    };

    gBootButtons.createShowHideLabBtn = function(element, action) {
        var elementClass,
            iNode,
            title,
            tooltipNode;

        elementClass = gStrings.show_class;
        title = gStrings.lab_show_tooltip;

        if (action === 'hide') {
            elementClass = gStrings.hide_class;
            title = gStrings.lab_hide_tooltip;
        }

        tooltipNode = html.tooltip();
        tooltipNode.setAttribute('title', sprintf(title, element));

        iNode = document.createElement('i');
        iNode.setAttribute('data-id', element);
        iNode.setAttribute('data-action', action);
        iNode.className = 'lab-click-btn ' + elementClass;

        tooltipNode.appendChild(iNode);

        return tooltipNode;
    };

    /**
     * Function that show/hide a lab section.
     *
     * @param {Event} event: The event that triggers this function.
    **/
    gBootButtons.showHideLab = function(event) {
        var accordion,
            element,
            elementId,
            parent,
            smallNode;

        element = event.target || event.srcElement;
        parent = element.parentNode;
        elementId = element.getAttribute('data-id');
        accordion = document.getElementById('accordion-' + elementId);

        if (element.getAttribute('data-action') === 'hide') {
            accordion.style.setProperty('display', 'none');
            element.setAttribute('data-action', 'show');

            smallNode = document.createElement('small');
            smallNode.insertAdjacentHTML(
                'beforeend', sprintf(gStrings.lab_hidden, elementId));

            html.replaceContent(
                document.getElementById('view-' + elementId), smallNode);

            html.removeClass(element, gStrings.hide_class);
            html.addClass(element, gStrings.show_class);

            $(parent).tooltip('destroy')
                .attr(
                    'data-original-title',
                    sprintf(gStrings.lab_show_tooltip, elementId))
                .tooltip('fixTitle');
        } else {
            accordion.style.setProperty('display', 'block');
            element.setAttribute('data-action', 'hide');

            html.removeChildren(document.getElementById('view-' + elementId));

            html.removeClass(element, 'fa-eye');
            html.addClass(element, 'fa-eye-slash');

            $(parent).tooltip('destroy')
                .attr(
                    'data-original-title',
                    sprintf(gStrings.lab_hide_tooltip, elementId))
                .tooltip('fixTitle');
        }
    };

    return gBootButtons;
});
