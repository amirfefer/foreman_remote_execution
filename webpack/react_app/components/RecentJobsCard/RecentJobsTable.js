import PropTypes from 'prop-types';
import React from 'react';
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  DataListWrapModifier,
  Title,
  Bullseye,
} from '@patternfly/react-core';

import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';

import JobStatusIcon from './JobStatusIcon';
import { JOB_API_URL, JOBS_IN_CARD } from './constants';

const RecentJobsTable = ({ status, hostId }) => {
  const jobsUrl =
    hostId &&
    foremanUrl(
      `${JOB_API_URL}${hostId}+and+status%3D${status}&per_page=${JOBS_IN_CARD}`
    );
  const {
    response: { results: jobs },
    status: responseStatus,
  } = useAPI('get', jobsUrl);

  return (
    <DataList aria-label="recent-jobs-table" isCompact>
      <SkeletonLoader
        skeletonProps={{ count: 3 }}
        status={responseStatus}
        emptyState={
          <Bullseye>
            <Title headingLevel="h2">{__('No Results found')}</Title>
          </Bullseye>
        }
      >
        {jobs?.map(
          ({
            status: jobStatus,
            status_label: label,
            id,
            start_at: startAt,
            description,
          }) => (
            <DataListItem aria-labelledby="simple-item1">
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell
                      wrapModifier={DataListWrapModifier.truncate}
                      key={`name-${id}`}
                    >
                      <a href={foremanUrl(`/job_invocations/${id}`)}>
                        {description}
                      </a>
                    </DataListCell>,
                    <DataListCell key={`date-${id}`}>
                      <RelativeDateTime date={startAt} />
                    </DataListCell>,
                    <DataListCell key={`status-${id}`}>
                      <JobStatusIcon status={jobStatus}>{label}</JobStatusIcon>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          )
        )}
      </SkeletonLoader>
    </DataList>
  );
};

RecentJobsTable.propTypes = {
  hostId: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default RecentJobsTable;