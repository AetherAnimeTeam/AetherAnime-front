import React from 'react';

const genreColors = {
    "Ужасы": "rgba(222, 81, 81, 1)",
    "Драма": "rgba(81, 222, 206, 1)",
    "Фантастика": "rgba(167, 47, 237, 1)",
    "Романтика": "rgba(237, 47, 224, 1)",
    "Мелодрама": "rgba(215, 222, 81, 1)",
    "Триллер": "rgba(222, 147, 81, 1)"
}

const StatusLine = ({ data }) => {
    const totalCount = Object.values(data).reduce((current, value) => current+value, 0)
    const dataLength = Object.keys(data).length

    const colorSegments = Object.entries(data).map(([genre, count], index) => {
        const borderRadius = {
            borderTopLeftRadius: index === 0 ? '10px' : '0',
            borderBottomLeftRadius: index === 0 ? '10px' : '0',
            borderTopRightRadius: index === dataLength - 1 ? '10px' : '0',
            borderBottomRightRadius: index === dataLength - 1 ? '10px' : '0',
        };

        const width = (count / totalCount) * 100;
        return (
            <div
                key={genre}
                style={{
                    width: `${width}%`,
                    backgroundColor: genreColors[genre],
                    height: '16px',
                    display: 'inline-block',
                    ...borderRadius
                }}
            />
        );
    });

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {colorSegments}
    </div>
  );
};

export default StatusLine;