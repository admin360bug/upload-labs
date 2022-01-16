﻿/*
 * FCKeditor - The text editor for Internet - http://www.fckeditor.net
 * Copyright (C) 2003-2007 Frederico Caldeira Knabben
 *
 * == BEGIN LICENSE ==
 *
 * Licensed under the terms of any of the following licenses at your
 * choice:
 *
 *  - GNU General Public License Version 2 or later (the "GPL")
 *    http://www.gnu.org/licenses/gpl.html
 *
 *  - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 *    http://www.gnu.org/licenses/lgpl.html
 *
 *  - Mozilla Public License Version 1.1 or later (the "MPL")
 *    http://www.mozilla.org/MPL/MPL-1.1.html
 *
 * == END LICENSE ==
 *
 * Creation and initialization of the "FCK" object. This is the main
 * object that represents an editor instance.
 * (IE specific implementations)
 */

FCK.Description = "FCKeditor for Internet Explorer 5.5+" ;

FCK._GetBehaviorsStyle = function()
{
	if ( !FCK._BehaviorsStyle )
	{
		var sBasePath = FCKConfig.FullBasePath ;
		var sTableBehavior = '' ;
		var sStyle ;

		// The behaviors should be pointed using the FullBasePath to avoid security
		// errors when using a differente BaseHref.
		sStyle = '<style type="text/css" _fcktemp="true">' ;

		if ( FCKConfig.ShowBorders )
			sTableBehavior = 'url(' + sBasePath + 'css/behaviors/showtableborders.htc)' ;

		// Disable resize handlers.
		sStyle += 'INPUT,TEXTAREA,SELECT,.FCK__Anchor,.FCK__PageBreak,.FCK__InputHidden' ;

		if ( FCKConfig.DisableObjectResizing )
		{
			sStyle += ',IMG' ;
			sTableBehavior += ' url(' + sBasePath + 'css/behaviors/disablehandles.htc)' ;
		}

		sStyle += ' { behavior: url(' + sBasePath + 'css/behaviors/disablehandles.htc) ; }' ;

		if ( sTableBehavior.length > 0 )
			sStyle += 'TABLE { behavior: ' + sTableBehavior + ' ; }' ;

		sStyle += '</style>' ;
		FCK._BehaviorsStyle = sStyle ;
	}

	return FCK._BehaviorsStyle ;
}

function Doc_OnMouseUp()
{
	if ( FCK.EditorWindow.event.srcElement.tagName == 'HTML' )
	{
		FCK.Focus() ;
		FCK.EditorWindow.event.cancelBubble	= true ;
		FCK.EditorWindow.event.returnValue	= false ;
	}
}

function Doc_OnPaste()
{
	return ( FCK.Status == FCK_STATUS_COMPLETE && FCK.Events.FireEvent( "OnPaste" ) ) ;
}

function Doc_OnKeyDown()
{
	if ( FCK.EditorWindow )
	{
		var e = FCK.EditorWindow.event ;

		if ( !( e.keyCode >=16 && e.keyCode <= 18 ) )
			Doc_OnKeyDownUndo() ;
	}
	return true ;
}

function Doc_OnKeyDownUndo()
{
	if ( !FCKUndo.Typing )
	{
		FCKUndo.SaveUndoStep() ;
		FCKUndo.Typing = true ;
		FCK.Events.FireEvent( "OnSelectionChange" ) ;
	}

	FCKUndo.TypesCount++ ;

	if ( FCKUndo.TypesCount > FCKUndo.MaxTypes )
	{
		FCKUndo.TypesCount = 0 ;
		FCKUndo.SaveUndoStep() ;
	}
}

function Doc_OnDblClick()
{
	FCK.OnDoubleClick( FCK.EditorWindow.event.srcElement ) ;
	FCK.EditorWindow.event.cancelBubble = true ;
}

function Doc_OnSelectionChange()
{
	FCK.Events.FireEvent( "OnSelectionChange" ) ;
}

FCK.InitializeBehaviors = function( dontReturn )
{
	// Set the focus to the editable area when clicking in the document area.
	// TODO: The cursor must be positioned at the end.
	this.EditorDocument.attachEvent( 'onmouseup', Doc_OnMouseUp ) ;

	// Intercept pasting operations
	this.EditorDocument.body.attachEvent( 'onpaste', Doc_OnPaste ) ;

	// Reset the context menu.
	FCK.ContextMenu._InnerContextMenu.AttachToElement( FCK.EditorDocument.body ) ;

	// Build the "TAB" key replacement (if necessary).
	if ( FCKConfig.TabSpaces > 0 )
	{
		window.FCKTabHTML = '' ;
		for ( i = 0 ; i < FCKConfig.TabSpaces ; i++ )
			window.FCKTabHTML += "&nbsp;" ;
	}
	this.EditorDocument.attachEvent("onkeydown", Doc_OnKeyDown ) ;

	this.EditorDocument.attachEvent("ondblclick", Doc_OnDblClick ) ;

	// Catch cursor selection changes.
	this.EditorDocument.attachEvent("onselectionchange", Doc_OnSelectionChange ) ;
}

FCK.InsertHtml = function( html )
{
	html = FCKConfig.ProtectedSource.Protect( html ) ;
	html = FCK.ProtectEvents( html ) ;
	html = FCK.ProtectUrls( html ) ;
	html = FCK.ProtectTags( html ) ;

//	FCK.Focus() ;
	FCK.EditorWindow.focus() ;

	FCKUndo.SaveUndoStep() ;

	// Gets the actual selection.
	var oSel = FCK.EditorDocument.selection ;

	// Deletes the actual selection contents.
	if ( oSel.type.toLowerCase() == 'control' )
		oSel.clear() ;

	// Using the following trick, any comment in the begining of the HTML will
	// be preserved.
	html = '<span id="__fakeFCKRemove__">&nbsp;</span>' + html ;

	// Insert the HTML.
	oSel.createRange().pasteHTML( html ) ;

	// Remove the fake node
	FCK.EditorDocument.getElementById('__fakeFCKRemove__').removeNode( true ) ;

	FCKDocumentProcessor.Process( FCK.EditorDocument ) ;
}

FCK.SetInnerHtml = function( html )		// IE Only
{
	var oDoc = FCK.EditorDocument ;
	// Using the following trick, any comment in the begining of the HTML will
	// be preserved.
	oDoc.body.innerHTML = '<div id="__fakeFCKRemove__">&nbsp;</div>' + html ;
	oDoc.getElementById('__fakeFCKRemove__').removeNode( true ) ;
}

function FCK_PreloadImages()
{
	var oPreloader = new FCKImagePreloader() ;

	// Add the configured images.
	oPreloader.AddImages( FCKConfig.PreloadImages ) ;

	// Add the skin icons strip.
	oPreloader.AddImages( FCKConfig.SkinPath + 'fck_strip.gif' ) ;

	oPreloader.OnComplete = LoadToolbarSetup ;
	oPreloader.Start() ;
}

// Disable the context menu in the editor (outside the editing area).
function Document_OnContextMenu()
{
	return ( event.srcElement._FCKShowContextMenu == true ) ;
}
document.oncontextmenu = Document_OnContextMenu ;

function FCK_Cleanup()
{
	this.EditorWindow = null ;
	this.EditorDocument = null ;
}

FCK.Paste = function()
{
	// As we call ExecuteNamedCommand('Paste'), it would enter in a loop. So, let's use a semaphore.
	if ( FCK._PasteIsRunning )
		return true ;

	if ( FCKConfig.ForcePasteAsPlainText )
	{
		FCK.PasteAsPlainText() ;
		return false ;
	}

	var sHTML = FCK._CheckIsPastingEnabled( true ) ;

	if ( sHTML === false )
		FCKTools.RunFunction( FCKDialog.OpenDialog, FCKDialog, ['FCKDialog_Paste', FCKLang.Paste, 'dialog/fck_paste.html', 400, 330, 'Security'] ) ;
	else
	{
		if ( FCKConfig.AutoDetectPasteFromWord && sHTML.length > 0 )
		{
			var re = /<\w[^>]*(( class="?MsoNormal"?)|(="mso-))/gi ;
			if ( re.test( sHTML ) )
			{
				if ( confirm( FCKLang.PasteWordConfirm ) )
				{
					FCK.PasteFromWord() ;
					return false ;
				}
			}
		}

		// Instead of inserting the retrieved HTML, let's leave the OS work for us,
		// by calling FCK.ExecuteNamedCommand( 'Paste' ). It could give better results.

		// Enable the semaphore to avoid a loop.
		FCK._PasteIsRunning = true ;

		FCK.ExecuteNamedCommand( 'Paste' ) ;

		// Removes the semaphore.
		delete FCK._PasteIsRunning ;
	}

	// Let's always make a custom implementation (return false), otherwise
	// the new Keyboard Handler may conflict with this code, and the CTRL+V code
	// could result in a simple "V" being pasted.
	return false ;
}

FCK.PasteAsPlainText = function()
{
	if ( !FCK._CheckIsPastingEnabled() )
	{
		FCKDialog.OpenDialog( 'FCKDialog_Paste', FCKLang.PasteAsText, 'dialog/fck_paste.html', 400, 330, 'PlainText' ) ;
		return ;
	}

	// Get the data available in the clipboard in text format.
	var sText = clipboardData.getData("Text") ;

	if ( sText && sText.length > 0 )
	{
		// Replace the carriage returns with <BR>
		sText = FCKTools.HTMLEncode( sText ).replace( /\n/g, '<BR>' ) ;

		// Insert the resulting data in the editor.
		this.InsertHtml( sText ) ;
	}
}

FCK._CheckIsPastingEnabled = function( returnContents )
{
	// The following seams to be the only reliable way to check is script
	// pasting operations are enabled in the secutiry settings of IE6 and IE7.
	// It adds a little bit of overhead to the check, but so far that's the
	// only way, mainly because of IE7.

	FCK._PasteIsEnabled = false ;

	document.body.attachEvent( 'onpaste', FCK_CheckPasting_Listener ) ;

	// The execCommand in GetClipboardHTML will fire the "onpaste", only if the
	// security settings are enabled.
	var oReturn = FCK.GetClipboardHTML() ;

	document.body.detachEvent( 'onpaste', FCK_CheckPasting_Listener ) ;

	if ( FCK._PasteIsEnabled )
	{
		if ( !returnContents )
			oReturn = true ;
	}
	else
		oReturn = false ;

	delete FCK._PasteIsEnabled ;

	return oReturn ;
}

function FCK_CheckPasting_Listener()
{
	FCK._PasteIsEnabled = true ;
}

FCK.InsertElement = function( element )
{
	FCK.InsertHtml( element.outerHTML ) ;
}

FCK.GetClipboardHTML = function()
{
	var oDiv = document.getElementById( '___FCKHiddenDiv' ) ;

	if ( !oDiv )
	{
		oDiv = document.createElement( 'DIV' ) ;
		oDiv.id = '___FCKHiddenDiv' ;

		var oDivStyle = oDiv.style ;
		oDivStyle.position		= 'absolute' ;
		oDivStyle.visibility	= oDivStyle.overflow	= 'hidden' ;
		oDivStyle.width			= oDivStyle.height		= 1 ;

		document.body.appendChild( oDiv ) ;
	}

	oDiv.innerHTML = '' ;

	var oTextRange = document.body.createTextRange() ;
	oTextRange.moveToElementText( oDiv ) ;
	oTextRange.execCommand( 'Paste' ) ;

	var sData = oDiv.innerHTML ;
	oDiv.innerHTML = '' ;

	return sData ;
}

FCK.CreateLink = function( url )
{
	// Creates the array that will be returned. It contains one or more created links (see #220).
	var aCreatedLinks = new Array() ;

	// Remove any existing link in the selection.
	FCK.ExecuteNamedCommand( 'Unlink' ) ;

	if ( url.length > 0 )
	{
		// If there are several images, and you try to link each one, all the images get inside the link:
		// <img><img> -> <a><img></a><img> -> <a><img><img></a> due to the call to 'CreateLink' (bug in IE)
		if (FCKSelection.GetType() == 'Control')
		{
			// Create a link
			var oLink = this.EditorDocument.createElement( 'A' ) ;
			oLink.href = url ;

			// Get the selected object
			var oControl = FCKSelection.GetSelectedElement() ;
			// Put the link just before the object
			oControl.parentNode.insertBefore(oLink, oControl) ;
			// Move the object inside the link
			oControl.parentNode.removeChild( oControl ) ;
			oLink.appendChild( oControl ) ;

			return [ oLink ] ;
		}

		// Generate a temporary name for the link.
		var sTempUrl = 'javascript:void(0);/*' + ( new Date().getTime() ) + '*/' ;

		// Use the internal "CreateLink" command to create the link.
		FCK.ExecuteNamedCommand( 'CreateLink', sTempUrl ) ;

		// Look for the just create link.
		var oLinks = this.EditorDocument.links ;

		for ( i = 0 ; i < oLinks.length ; i++ )
		{
			var oLink = oLinks[i] ;

			// Check it this a newly created link.
			// getAttribute must be used. oLink.url may cause problems with IE7 (#555).
			if ( oLink.getAttribute( 'href', 2 ) == sTempUrl )
			{
				var sInnerHtml = oLink.innerHTML ;	// Save the innerHTML (IE changes it if it is like an URL).
				oLink.href = url ;
				oLink.innerHTML = sInnerHtml ;		// Restore the innerHTML.

				// If the last child is a <br> move it outside the link or it
				// will be too easy to select this link again #388.
				var oLastChild = oLink.lastChild ;
				if ( oLastChild && oLastChild.nodeName == 'BR' )
				{
					// Move the BR after the link.
					FCKDomTools.InsertAfterNode( oLink, oLink.removeChild( oLastChild ) ) ;
				}

				aCreatedLinks.push( oLink ) ;
			}
		}
	}

	return aCreatedLinks ;
}
