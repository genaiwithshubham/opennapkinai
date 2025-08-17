#!/usr/bin/env python3
"""
SVG Path to JavaScript Converter

This script takes XML containing SVG paths and converts them to JavaScript
statements using rc.path() format for rough.js or similar libraries.

Usage:
    python svg_converter.py input.xml
    or
    python svg_converter.py  # reads from stdin
"""

import xml.etree.ElementTree as ET
import sys
import json
from pathlib import Path

def parse_svg_attributes(element):
    """Parse SVG element attributes and return a dictionary of relevant properties."""
    # Common SVG path attributes we want to preserve
    relevant_attrs = {
        'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
        'stroke-linejoin', 'stroke-miterlimit', 'fill-rule', 'opacity',
        'fill-opacity', 'stroke-opacity', 'transform'
    }
    
    attrs = {}
    for attr, value in element.attrib.items():
        # Convert kebab-case to camelCase for JavaScript
        js_attr = attr.replace('-', '_').lower()
        if attr == 'fill-rule':
            js_attr = 'fillRule'
        elif attr == 'stroke-width':
            js_attr = 'strokeWidth'
        elif attr == 'stroke-dasharray':
            js_attr = 'strokeDasharray'
        elif attr == 'stroke-linecap':
            js_attr = 'strokeLinecap'
        elif attr == 'stroke-linejoin':
            js_attr = 'strokeLinejoin'
        elif attr == 'stroke-miterlimit':
            js_attr = 'strokeMiterlimit'
        elif attr == 'fill-opacity':
            js_attr = 'fillOpacity'
        elif attr == 'stroke-opacity':
            js_attr = 'strokeOpacity'
        else:
            js_attr = attr
        
        if attr in relevant_attrs or attr == 'd':
            attrs[js_attr] = value
    
    return attrs

def format_properties_object(props):
    """Format properties dictionary as JavaScript object string."""
    if not props:
        return "{}"
    
    # Format each property
    formatted_props = []
    for key, value in props.items():
        # Add quotes around the value
        formatted_props.append(f'"{key}":"{value}"')
    
    return "{" + ", ".join(formatted_props) + "}"

def convert_svg_paths(xml_content):
    """Convert SVG paths in XML to JavaScript rc.path() statements."""
    try:
        # Parse XML
        root = ET.fromstring(xml_content)
        
        # Find all path elements (handle namespaces)
        paths = []
        
        # Look for path elements at any level
        for path in root.iter():
            if path.tag.endswith('path') or path.tag == 'path':
                paths.append(path)
        
        if not paths:
            print("No path elements found in the XML.")
            return
        
        # Convert each path
        js_statements = []
        for path in paths:
            attrs = parse_svg_attributes(path)
            
            d_value = attrs.pop('d', '')
            if not d_value:
                print(f"Warning: Path element missing 'd' attribute, skipping.")
                continue
    
            js_statements.append({
                "path": d_value,
                "options": attrs
            })
        
        # Output all statements
        with open('output.json', 'w', encoding='utf-8') as f:
            json.dump(js_statements, f, indent=4)

    except ET.ParseError as e:
        print(f"Error parsing XML: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error processing SVG: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """Main function to handle command line arguments and input."""
    if len(sys.argv) > 1:
        # Read from file
        input_file = Path(sys.argv[1])
        if not input_file.exists():
            print(f"Error: File '{input_file}' not found.", file=sys.stderr)
            sys.exit(1)
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                xml_content = f.read()
        except Exception as e:
            print(f"Error reading file: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        # Read from stdin
        print("Reading XML from stdin... (Press Ctrl+D when done)")
        xml_content = sys.stdin.read()
    
    if not xml_content.strip():
        print("Error: No XML content provided.", file=sys.stderr)
        sys.exit(1)
    
    convert_svg_paths(xml_content)

if __name__ == "__main__":
    main()