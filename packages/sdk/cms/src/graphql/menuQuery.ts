import type { DocumentNode, FieldNode, FragmentDefinitionNode, SelectionSetNode } from 'graphql';
import { queries } from './queries';

/** Levels of menu items a menu read selects when the caller asks for no depth. */
export const MENU_DEPTH_DEFAULT = 3;

/**
 * The deepest menu the SDK fetches. This is the SDK's own limit for navigation menus, not
 * the API's: the Merchant API itself refuses more than 60 levels (`MAX_DEPTH_EXCEEDED`,
 * measured; not documented).
 */
export const MENU_DEPTH_MAX = 6;

const built = new Map<number, DocumentNode>();

/**
 * The menu document selecting `depth` levels of menu items, counting the top items as 1.
 * The default depth is the document of the `.gql` files itself; any other depth is built
 * once and reused.
 */
export function menuQuery(depth: number = MENU_DEPTH_DEFAULT): DocumentNode {
  if (depth === MENU_DEPTH_DEFAULT) return queries.menu;
  let doc = built.get(depth);
  if (!doc) {
    doc = buildMenuQuery(depth);
    built.set(depth, doc);
  }
  return doc;
}

/**
 * Builds the menu document for `depth` from the `.gql` files: GraphQL has no recursive
 * selection, so the `MenuItemBase` fragment's `children` field is nested `depth - 1` times.
 * Every other definition is kept as it is. The nodes built here carry no `loc`: the
 * original's points into the three-level source text.
 */
export function buildMenuQuery(depth: number): DocumentNode {
  const menu = withoutLoc(queries.menu);
  return {
    ...menu,
    definitions: menu.definitions.map((def) =>
      isMenuItemBase(def) ? { ...withoutLoc(def), selectionSet: nestChildren(def.selectionSet, depth) } : def,
    ),
  };
}

function withoutLoc<T extends { loc?: unknown }>(node: T): Omit<T, 'loc'> {
  const { loc: _loc, ...rest } = node;
  return rest;
}

function isMenuItemBase(def: DocumentNode['definitions'][number]): def is FragmentDefinitionNode {
  return def.kind === 'FragmentDefinition' && def.name.value === 'MenuItemBase';
}

function isChildren(selection: SelectionSetNode['selections'][number]): selection is FieldNode {
  return selection.kind === 'Field' && selection.name.value === 'children';
}

/** The item's own selection, with `children` nested to `depth` levels in total. */
function nestChildren(base: SelectionSetNode, depth: number): SelectionSetNode {
  const children = base.selections.find(isChildren);
  const own = base.selections.filter((selection) => !isChildren(selection));
  if (!children || depth === 1) return { ...withoutLoc(base), selections: own };
  return {
    ...withoutLoc(base),
    selections: [{ ...withoutLoc(children), selectionSet: nestChildren(base, depth - 1) }, ...own],
  };
}
