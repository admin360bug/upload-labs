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
 * Preload a list of images, firing an event when complete.
 */

var FCKImagePreloader = function()
{
	this._Images = new Array() ;
}

FCKImagePreloader.prototype =
{
	AddImages : function( images )
	{
		if ( typeof( images ) == 'string' )
			images = images.split( ';' ) ;

		this._Images = this._Images.concat( images ) ;
	},

	Start : function()
	{
		var aImages = this._Images ;
		this._PreloadCount = aImages.length ;

		for ( var i = 0 ; i < aImages.length ; i++ )
		{
			var eImg = document.createElement( 'img' ) ;
			eImg.onload = eImg.onerror = _FCKImagePreloader_OnImage ;
			eImg._FCKImagePreloader = this ;
			eImg.src = aImages[i] ;

			_FCKImagePreloader_ImageCache.push( eImg ) ;
		}
	}
};

// All preloaded images must be placed in a global array, otherwise the preload
// magic will not happen.
var _FCKImagePreloader_ImageCache = new Array() ;

function _FCKImagePreloader_OnImage()
{
	var oImagePreloader = this._FCKImagePreloader ;

	if ( (--oImagePreloader._PreloadCount) == 0 && oImagePreloader.OnComplete )
		oImagePreloader.OnComplete() ;

	this._FCKImagePreloader = null ;
}