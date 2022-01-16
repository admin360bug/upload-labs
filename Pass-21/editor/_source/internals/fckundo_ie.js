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
 * IE specific implementation for the Undo/Redo system.
 */

var FCKUndo = new Object() ;

FCKUndo.SavedData = new Array() ;
FCKUndo.CurrentIndex = -1 ;
FCKUndo.TypesCount = FCKUndo.MaxTypes = 25 ;
FCKUndo.Typing = false ;

FCKUndo.SaveUndoStep = function()
{
	if ( FCK.EditMode != FCK_EDITMODE_WYSIWYG )
		return ;

	// Shrink the array to the current level.
	FCKUndo.SavedData = FCKUndo.SavedData.slice( 0, FCKUndo.CurrentIndex + 1 ) ;

	// Get the Actual HTML.
	var sHtml = FCK.EditorDocument.body.innerHTML ;

	// Cancel operation if the new step is identical to the previous one.
	if ( FCKUndo.CurrentIndex >= 0 && sHtml == FCKUndo.SavedData[ FCKUndo.CurrentIndex ][0] )
		return ;

	// If we reach the Maximun number of undo levels, we must remove the first
	// entry of the list shifting all elements.
	if ( FCKUndo.CurrentIndex + 1 >= FCKConfig.MaxUndoLevels )
		FCKUndo.SavedData.shift() ;
	else
		FCKUndo.CurrentIndex++ ;

	// Get the actual selection.
	var sBookmark ;
	if ( FCK.EditorDocument.selection.type == 'Text' )
		sBookmark = FCK.EditorDocument.selection.createRange().getBookmark() ;

	// Save the new level in front of the actual position.
	FCKUndo.SavedData[ FCKUndo.CurrentIndex ] = [ sHtml, sBookmark ] ;

	FCK.Events.FireEvent( "OnSelectionChange" ) ;
}

FCKUndo.CheckUndoState = function()
{
	return ( FCKUndo.Typing || FCKUndo.CurrentIndex > 0 ) ;
}

FCKUndo.CheckRedoState = function()
{
	return ( !FCKUndo.Typing && FCKUndo.CurrentIndex < ( FCKUndo.SavedData.length - 1 ) ) ;
}

FCKUndo.Undo = function()
{
	if ( FCKUndo.CheckUndoState() )
	{
		// If it is the first step.
		if ( FCKUndo.CurrentIndex == ( FCKUndo.SavedData.length - 1 ) )
		{
			// Save the actual state for a possible "Redo" call.
			FCKUndo.SaveUndoStep() ;
		}

		// Go a step back.
		FCKUndo._ApplyUndoLevel( --FCKUndo.CurrentIndex ) ;

		FCK.Events.FireEvent( "OnSelectionChange" ) ;
	}
}

FCKUndo.Redo = function()
{
	if ( FCKUndo.CheckRedoState() )
	{
		// Go a step forward.
		FCKUndo._ApplyUndoLevel( ++FCKUndo.CurrentIndex ) ;

		FCK.Events.FireEvent( "OnSelectionChange" ) ;
	}
}

FCKUndo._ApplyUndoLevel = function(level)
{
	var oData = FCKUndo.SavedData[ level ] ;

	if ( !oData )
		return ;

	// Update the editor contents with that step data.
	FCK.SetInnerHtml( oData[0] ) ;
//	FCK.EditorDocument.body.innerHTML = oData[0] ;

	if ( oData[1] )
	{
		var oRange = FCK.EditorDocument.selection.createRange() ;
		oRange.moveToBookmark( oData[1] ) ;
		oRange.select() ;
	}

	FCKUndo.TypesCount = 0 ;
	FCKUndo.Typing = false ;
}