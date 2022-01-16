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
 * Contains browser detection information.
 */

var s = navigator.userAgent.toLowerCase() ;

var FCKBrowserInfo =
{
	IsIE		: s.Contains('msie'),
	IsIE7		: s.Contains('msie 7'),
	IsGecko		: s.Contains('gecko/'),
	IsSafari	: s.Contains('safari'),
	IsOpera		: s.Contains('opera'),
	IsMac		: s.Contains('macintosh')
} ;

// Completes the browser info with further Gecko information.
(function( browserInfo )
{
	browserInfo.IsGeckoLike = ( browserInfo.IsGecko || browserInfo.IsSafari || browserInfo.IsOpera ) ;

	if ( browserInfo.IsGecko )
	{
		var geckoVersion = s.match( /gecko\/(\d+)/ )[1] ;

		// Actually "10" refers to Gecko versions before Firefox 1.5, when
		// Gecko 1.8 (build 20051111) has been released.

		// Some browser (like Mozilla 1.7.13) may have a Gecko build greater
		// than 20051111, so we must also check for the revision number not to
		// be 1.7 (we are assuming that rv < 1.7 will not have build > 20051111).

		// TODO: Future versions may consider the rv number only, but it is
		// still to check that all Gecko based browser present the rv number.
		browserInfo.IsGecko10 = ( ( geckoVersion < 20051111 ) || ( /rv:1\.7/.test(s) ) ) ;
	}
	else
		browserInfo.IsGecko10 = false ;
})(FCKBrowserInfo) ;