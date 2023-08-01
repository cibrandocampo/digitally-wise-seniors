var HintType = {
  None: 'None',
  RowsMustBeUnique: 'Ningunha fila pode ser igual a outra.',
  ColsMustBeUnique: 'Ningunha columna pode ser igual a outra.',
  RowMustBeBalanced: 'As filas deben conter a mesma cantidade de baldosas de cada cor.',
  ColMustBeBalanced: 'As columnas deben conter a mesma cantidade de baldosas de cada cor.',
  MaxTwoRed: 'Non se permiten tres fichas vermellas xuntas.',
  MaxTwoBlue: 'Non se permiten tres fichas azuis xuntas.',
  SinglePossibleRowCombo: 'So existe unha posibilidade',
  SinglePossibleColCombo: 'So existe unha posibilidade',
  Error: 'Esta non parece correcta.',
  Errors: 'Estas non parecen correctas.'
};

function Hint(grid) {
  var self = this,
      active = false,
      visible = false,
      info = {
        type: HintType.None,
        tile: null,
        tile2: null,
        doubleRowOrCol: []
      }

  this.doubleColFound = [];
  this.doubleRowFound = [];

  function clear() {
    this.doubleColFound = [];
    this.doubleRowFound = [];
    hide();
    if (grid)
      grid.unmark();
    active = false;
    info = {
      type: HintType.None,
      tile: null,
      tile2: null,
      doubleRowOrCol: []
    }
  }

  function mark(tile, hintType, tile2, doubleRowOrCol) {
    if (active) {
      //console.log('mark', hintType, doubleRowOrCol)
      //console.log('tiles', tile, tile2)
      info.tile = tile;
      info.tile2 = tile2 || null;
      info.type = hintType;
      info.doubleRowOrCol = doubleRowOrCol;
      return true;
    }
    return false;
  }

  function next() {
    var wrongTiles = grid.wrongTiles;
    if (wrongTiles.length) {
      if (wrongTiles.length == 1) {
        wrongTiles[0].mark();
        show(HintType.Error);
      } else {
        $(wrongTiles).each(function(){
          this.mark();
        })
        show(HintType.Errors);
      }
      return;
    }
    active = true;
    grid.solve(false, true);
    if (info.tile) {
      show(info.type);      
      switch (info.type) {
        case HintType.RowMustBeBalanced:
          grid.markRow(info.tile.y);
          break;
        case HintType.ColMustBeBalanced:
          grid.markCol(info.tile.x);
          break;
        case HintType.RowsMustBeUnique:
          grid.markRow(info.tile.y);
          grid.markRow(info.doubleRowOrCol[0] != info.tile.y ? info.doubleRowOrCol[0] : info.doubleRowOrCol[1]);
          break;
        case HintType.ColsMustBeUnique:
          grid.markCol(info.tile.x);
          grid.markCol(info.doubleRowOrCol[0] != info.tile.x ? info.doubleRowOrCol[0] : info.doubleRowOrCol[1]);
          break;
        default:
          if (info.tile2)
            info.tile2.mark();
          info.tile.mark();
          break;
      }
    }
  }

  function show(type) {
    var s = type;
    $('#hintMsg').html('<span>' + s + '</span>');
    $('html').addClass('showHint');
    visible = true;
  }

  function hide() {
    $('html').removeClass('showHint');
    visible = false;
  }

  this.clear = clear;
  this.mark = mark;
  this.next = next;
  this.show = show;
  this.hide = hide;
  
  this.info = info;
  this.__defineGetter__('active', function() { return active; })
  this.__defineSetter__('active', function(v) { active = v; })
  this.__defineGetter__('visible', function() { return visible; })
};